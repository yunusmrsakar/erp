import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import ws from 'ws'

if (typeof globalThis.WebSocket === 'undefined') {
  (globalThis as any).WebSocket = ws
}

const connectionString = process.env.DATABASE_URL!
const adapter = new PrismaNeon({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seed başlatılıyor...')

  // ─── CUSTOMERS ────────────────────────────────────────────────
  const cust1 = await prisma.customer.upsert({
    where: { email: 'aytac.yilmaz@btechholding.com' },
    update: {},
    create: {
      name: 'Aytaç Yılmaz',
      email: 'aytac.yilmaz@btechholding.com',
      phone: '+90 532 100 2200',
      company: 'BTech Holding A.Ş.',
      address: 'Maslak Mah. Büyükdere Cad. No:123, İstanbul',
    },
  })

  await prisma.customer.upsert({
    where: { email: 'selin.kara@kara-gida.com' },
    update: {},
    create: {
      name: 'Selin Kara',
      email: 'selin.kara@kara-gida.com',
      phone: '+90 544 200 5566',
      company: 'Kara Gıda Sanayi',
      address: 'OSB 4. Cadde No:88, Ankara',
    },
  })
  console.log('✅ Müşteriler oluşturuldu')

  // ─── VENDORS ──────────────────────────────────────────────────
  const vendor1 = await prisma.vendor.upsert({
    where: { vendorCode: 'VND-001' },
    update: {},
    create: {
      vendorCode: 'VND-001',
      name: 'Anadolu Hammadde Tedarik A.Ş.',
      email: 'siparis@anadolu-hammadde.com',
      phone: '+90 212 500 1100',
      address: 'Ikitelli OSB, İstanbul',
    },
  })
  console.log('✅ Tedarikçiler oluşturuldu')

  // ─── PRODUCTS ─────────────────────────────────────────────────
  const rawWood = await prisma.product.upsert({
    where: { sku: 'HM-TAHTA-001' },
    update: {},
    create: { sku: 'HM-TAHTA-001', name: 'MDF Levha (120x60 cm)', productType: 'RAW_MATERIAL', price: 180, stock: 200, category: 'Ahşap/Mobilya', description: 'Ham MDF levha' },
  })
  const rawScrew = await prisma.product.upsert({
    where: { sku: 'HM-VIDA-001' },
    update: {},
    create: { sku: 'HM-VIDA-001', name: 'Mobilya Vidası (Kutu 200 adet)', productType: 'RAW_MATERIAL', price: 35, stock: 500, category: 'Metal', description: 'Montaj vida seti' },
  })
  const finishedDesk = await prisma.product.upsert({
    where: { sku: 'FG-MASA-001' },
    update: {},
    create: { sku: 'FG-MASA-001', name: 'Ahşap Ofis Masası (L Tipi)', productType: 'FINISHED_GOOD', price: 2850, stock: 12, category: 'Ahşap/Mobilya', description: 'MDF gövde, 160x80 cm' },
  })
  const finishedChair = await prisma.product.upsert({
    where: { sku: 'FG-SANDALYE-001' },
    update: {},
    create: { sku: 'FG-SANDALYE-001', name: 'Ergonomik Ofis Koltuğu', productType: 'FINISHED_GOOD', price: 1450, stock: 20, category: 'Ahşap/Mobilya', description: 'Mesh sırtlık, 5 yıl garanti' },
  })
  console.log('✅ Ürünler oluşturuldu')

  // ─── BOM ──────────────────────────────────────────────────────
  const existingBOM = await prisma.bOMItem.findFirst({ where: { finishedProductId: finishedDesk.id } })
  if (!existingBOM) {
    await prisma.bOMItem.createMany({
      data: [
        { finishedProductId: finishedDesk.id, rawMaterialId: rawWood.id, quantity: 4 },
        { finishedProductId: finishedDesk.id, rawMaterialId: rawScrew.id, quantity: 20 },
      ],
    })
    console.log('✅ BOM Reçeteleri oluşturuldu (Masa = 4x MDF + 20x Vida)')
  }

  // ─── EMPLOYEES ────────────────────────────────────────────────
  await prisma.employee.upsert({ where: { email: 'mehmet.ozturk@nexuserp.com' }, update: {}, create: { firstName: 'Mehmet', lastName: 'Öztürk', email: 'mehmet.ozturk@nexuserp.com', phone: '+90 505 300 1122', department: 'Finans (FI)', position: 'Mali Müşavir', salary: 42000 } })
  await prisma.employee.upsert({ where: { email: 'ayse.demir@nexuserp.com' }, update: {}, create: { firstName: 'Ayşe', lastName: 'Demir', email: 'ayse.demir@nexuserp.com', phone: '+90 506 400 9988', department: 'Satış (SD)', position: 'Kurumsal Satış Uzmanı', salary: 28500 } })
  await prisma.employee.upsert({ where: { email: 'kemal.arslan@nexuserp.com' }, update: {}, create: { firstName: 'Kemal', lastName: 'Arslan', email: 'kemal.arslan@nexuserp.com', phone: '+90 507 500 7744', department: 'Depo (MM)', position: 'Depo Sorumlusu', salary: 21000 } })
  console.log('✅ Personel oluşturuldu')

  // ─── EQUIPMENT (PM) ───────────────────────────────────────────
  const eq1 = await prisma.equipment.upsert({ where: { code: 'EQ-001' }, update: {}, create: { code: 'EQ-001', name: 'CNC Ahşap Freze Tezgahı', serialNumber: 'CNC-2022-00441', location: 'Üretim Hattı A', status: 'OPERATIONAL', purchaseDate: new Date('2022-03-15') } })
  await prisma.equipment.upsert({ where: { code: 'EQ-002' }, update: {}, create: { code: 'EQ-002', name: 'Elektrikli Forklift', serialNumber: 'FK-2021-00091', location: 'Depo - Raf Bölgesi', status: 'UNDER_MAINTENANCE', purchaseDate: new Date('2021-06-01') } })
  const existingTask = await prisma.maintenanceTask.findMany({ where: { equipmentId: eq1.id } })
  if (existingTask.length === 0) {
    await prisma.maintenanceTask.create({ data: { taskNumber: 'MNT-240301', equipmentId: eq1.id, taskType: 'PREVENTIVE', description: 'Yıllık yağlama ve bıçak değişimi', priority: 'MEDIUM', cost: 3500, scheduledDate: new Date('2026-04-05') } })
  }
  console.log('✅ Ekipman & bakım iş emri oluşturuldu')

  // ─── ADMIN USER ───────────────────────────────────────────────
  const bcrypt = await import('bcryptjs')
  const hash = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@nexuserp.com' },
    update: {},
    create: { name: 'Nexus Admin', email: 'admin@nexuserp.com', password: hash, role: 'ADMIN' },
  })
  console.log('✅ Admin kullanıcısı oluşturuldu')

  // ─── PURCHASE ORDER ───────────────────────────────────────────
  const existingPO = await prisma.purchaseOrder.findFirst()
  if (!existingPO) {
    await prisma.purchaseOrder.create({
      data: { poNumber: 'PO-2026-001', vendorId: vendor1.id, status: 'RECEIVED', paymentStatus: 'UNPAID', totalAmount: 43700,
        items: { create: [{ productId: rawWood.id, quantity: 100, unitCost: 180 }, { productId: rawScrew.id, quantity: 500, unitCost: 35 }] },
      },
    })
    console.log('✅ Satın Alma Siparişi oluşturuldu: PO-2026-001')
  }

  // ─── SALES ORDER ──────────────────────────────────────────────
  const existingOrder = await prisma.order.findFirst()
  if (!existingOrder) {
    const order = await prisma.order.create({
      data: { orderNumber: 'SD-2026-001', customerId: cust1.id, type: 'ORDER', status: 'SHIPPED', paymentStatus: 'UNPAID', total: 28500, notes: 'ACİL kargolama — 3 iş günü',
        items: { create: [{ productId: finishedDesk.id, quantity: 5, price: 2850 }, { productId: finishedChair.id, quantity: 10, price: 1450 }] },
      },
    })
    await prisma.financialTransaction.create({ data: { type: 'INCOME', amount: 15000, referenceType: 'SALE', referenceId: order.id, description: `Avans Tahsilat — ${order.orderNumber}` } })
    console.log('✅ Satış Siparişi ve FI kaydı oluşturuldu')
  }

  // ─── QUALITY INSPECTION ───────────────────────────────────────
  const existingQI = await prisma.qualityInspection.findFirst()
  if (!existingQI) {
    await prisma.qualityInspection.create({ data: { inspectionNumber: 'QI-240001', referenceType: 'PURCHASE', referenceId: 'PO-2026-001', referenceNumber: 'PO-2026-001', productId: rawWood.id, quantity: 100, status: 'PENDING' } })
    console.log('✅ Kalite kontrol formu oluşturuldu')
  }

  console.log('\n🎉 PostgreSQL Seed tamamlandı! Sistem test için hazır.')
}

main()
  .catch((e) => { console.error('❌ Seed hatası:', e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
