const BASE_URL = import.meta.env.VITE_HA_BASE_URL
const TOKEN = import.meta.env.VITE_HA_TOKEN

async function callService(domain, service, entityId) {
  const response = await fetch(`${BASE_URL}/api/services/${domain}/${service}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ entity_id: entityId }),
  })

  if (!response.ok) {
    throw new Error(`${domain}.${service} ล้มเหลว (HTTP ${response.status})`)
  }
}

// booking.haEntities shape:
// { lock: "lock.room_101_door", light: "light.room_101" | ["light.a", "light.b"], climate: "climate.room_101_ac" }
export async function openRoom(haEntities) {
  if (!BASE_URL || !TOKEN) {
    throw new Error('ยังไม่ได้ตั้งค่า VITE_HA_BASE_URL / VITE_HA_TOKEN')
  }

  const tasks = []
  if (haEntities.lock) tasks.push(callService('lock', 'unlock', haEntities.lock))
  if (haEntities.light) tasks.push(callService('homeassistant', 'turn_on', haEntities.light))
  if (haEntities.climate) tasks.push(callService('homeassistant', 'turn_on', haEntities.climate))

  if (tasks.length === 0) return

  const results = await Promise.allSettled(tasks)
  const failed = results.filter((r) => r.status === 'rejected')
  if (failed.length > 0) {
    throw new Error(
      `ควบคุมอุปกรณ์ไม่สำเร็จ ${failed.length}/${results.length} รายการ: ` +
        failed.map((r) => r.reason?.message || r.reason).join(', '),
    )
  }
}
