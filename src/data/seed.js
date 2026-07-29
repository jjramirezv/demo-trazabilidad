export const models = {
  distributor:{label:"Distribución",color:"emerald",description:"Compra productos terminados, controla su ingreso, almacena por lote y los entrega a clientes.",pipeline:["Compra","Recepción","Control de ingreso","Almacenamiento","Venta","Entrega"]},
  manufacturer:{label:"Transformación",color:"blue",description:"Transforma materias primas e insumos en un producto terminado con trazabilidad completa.",pipeline:["Materias primas","Control de calidad","Producción","Producto terminado","Almacenamiento","Venta"]},
  bulk:{label:"Producción y envasado",color:"orange",description:"Prepara un producto base en tanque, controla su calidad y luego lo envasa en presentaciones comerciales.",pipeline:["Ingredientes","Preparación","Control de calidad","Producto en tanque","Envasado","Producto terminado","Venta"]},
};
export const seed = {
  purchaseOrders:[
    {id:"OC-2026-001",supplierId:"SUP-001",supplier:"Asociación de Productores de Papa del Mantaro",product:"Papa Yungay",qty:500,unit:"kg",unitPrice:2.5,currency:"PEN",expectedDate:"18/07/2026",paymentTerms:"Crédito a 15 días",notes:"Entrega en jabas sanitizadas.",status:"Confirmado"},
  ],
  receipts:[
    {id:"REC-2026-001",purchaseId:"OC-2026-001",supplier:"Asociación de Productores de Papa del Mantaro",product:"Papa Yungay",requestedQty:500,unit:"kg",expectedDate:"18/07/2026",receivedQty:480,approvedQty:460,rejectedQty:20,supplierLot:"LT-PAP-1807",expiry:"18/08/2026",destination:"Frescos A-01",appearance:"Conforme",packaging:"Conforme",documentation:"Conforme",notes:"20 kg separados por daño mecánico.",lotId:"PAP-2026-001",status:"Recibido"},
  ],
  productionOrders:[
    {id:"OF-2026-001",recipeId:"BOM-CHIPS-100",product:"Chips de papa 100 g",plannedQty:1000,unit:"bolsas",plannedDate:"21/07/2026",workCenter:"Línea de fritura 1",components:[{product:"Papa Yungay",qty:120,unit:"kg",lotId:"PAP-2026-001"},{product:"Aceite vegetal",qty:18,unit:"L",lotId:"ACE-2026-001"},{product:"Sal",qty:3,unit:"kg",lotId:"SAL-2026-001"},{product:"Bolsa metalizada",qty:1000,unit:"unidad",lotId:"BOL-2026-001"}],producedQty:970,rejectedQty:20,sampleQty:5,lossQty:5,outputLotId:"CHIP-2026-001",expiry:"21/01/2027",status:"Terminada"},
    {id:"OF-2026-002",recipeId:"BOM-BASE-MANGO",product:"Jugo base de mango",plannedQty:1000,unit:"L",plannedDate:"22/07/2026",workCenter:"Área de preparación",components:[],producedQty:985,rejectedQty:0,sampleQty:5,lossQty:10,outputLotId:"BASE-MANGO-2026-001",expiry:"06/08/2026",status:"Terminada"},
  ],
  packagingOrders:[
    {id:"ENV-2026-001",productionOrderId:"OF-2026-002",sourceLotId:"BASE-MANGO-2026-001",recipeId:"BOM-JM500",product:"Jugo de mango de 500 ml",plannedQty:1940,unit:"botella",components:[{product:"Jugo base de mango",qty:970,unit:"L",lotId:"BASE-MANGO-2026-001"},{product:"Botella 500 ml",qty:1940,unit:"unidad",lotId:"BOT-2026-001"},{product:"Tapa",qty:1940,unit:"unidad",lotId:"TAP-2026-001"},{product:"Etiqueta",qty:1940,unit:"unidad",lotId:"ETQ-2026-001"}],producedQty:"",rejectedQty:"",outputLotId:"",expiry:"",status:"Lista"},
  ],
  salesOrders:[
    {id:"PV-2026-018",customerId:"CUS-002",customer:"Mercado Mayorista del Centro",product:"Papa Yungay",lotId:"PAP-2026-001",qty:200,unit:"kg",unitPrice:3.5,currency:"PEN",deliveryDate:"29/07/2026",paymentTerms:"Contado",notes:"Entrega de 08:00 a 11:00.",status:"Confirmado"},
  ],
  deliveries:[
    {id:"DES-2026-018",salesOrderId:"PV-2026-018",customerId:"CUS-002",customer:"Mercado Mayorista del Centro",product:"Papa Yungay",lotId:"PAP-2026-001",qty:200,unit:"kg",deliveryDate:"29/07/2026",destination:"El Tambo",carrier:"",vehicle:"",guideNumber:"",receivedBy:"",status:"Pendiente"},
  ],
  recipes:[
    {id:"BOM-CHIPS-100",name:"Chips de papa 100 g",outputQty:1000,outputUnit:"bolsas",components:[{product:"Papa Yungay",qty:120,unit:"kg"},{product:"Aceite vegetal",qty:18,unit:"L"},{product:"Sal",qty:3,unit:"kg"},{product:"Bolsa metalizada",qty:1000,unit:"unidad"}],status:"Activa"},
    {id:"BOM-BASE-MANGO",name:"Jugo base de mango",outputQty:1000,outputUnit:"L",components:[{product:"Mango",qty:650,unit:"kg"},{product:"Agua tratada",qty:300,unit:"L"},{product:"Azúcar",qty:80,unit:"kg"}],status:"Activa"},
    {id:"BOM-JM500",name:"Jugo de mango 500 ml",outputQty:1,outputUnit:"botella",components:[{product:"Jugo base de mango",qty:0.5,unit:"L"},{product:"Botella 500 ml",qty:1,unit:"unidad"},{product:"Tapa",qty:1,unit:"unidad"},{product:"Etiqueta",qty:1,unit:"unidad"}],status:"Activa"},
  ],
  suppliers:[
    {id:"SUP-001",name:"Asociación de Productores de Papa del Mantaro",type:"Productor agrícola",location:"Sapallanga, Huancayo",tax:"20123456781",products:"Papa Yungay",registeredAt:"08/01/2026",status:"Activo"},
    {id:"SUP-002",name:"Distribuidora de Aceites Andinos",type:"Distribuidor",location:"El Tambo, Huancayo",tax:"20456789122",products:"Aceite vegetal",registeredAt:"15/01/2026",status:"Activo"},
    {id:"SUP-003",name:"Envases del Centro S.A.C.",type:"Proveedor de envases",location:"Chilca, Huancayo",tax:"20678912343",products:"Bolsas, botellas, tapas",registeredAt:"22/02/2026",status:"Activo"},
    {id:"SUP-004",name:"Frutas Andinas del Perú",type:"Productor agrícola",location:"Chanchamayo, Junín",tax:"20543210987",products:"Mango",registeredAt:"06/03/2026",status:"Activo"},
  ],
  customers:[
    {id:"CUS-001",name:"Supermercado Valle Central",type:"Supermercado",location:"Huancayo",tax:"20567890123",contact:"María Quispe",phone:"964 215 830",email:"compras@vallecentral.pe",channel:"Venta directa",paymentTerms:"Crédito a 30 días",registeredAt:"10/01/2026",orders:2,status:"Activo"},
    {id:"CUS-002",name:"Mercado Mayorista del Centro",type:"Mayorista",location:"El Tambo",tax:"20111222333",contact:"Luis Huamán",phone:"987 430 112",email:"pedidos@mayoristacentro.pe",channel:"Mayorista",paymentTerms:"Contado",registeredAt:"18/02/2026",orders:1,status:"Activo"},
    {id:"CUS-003",name:"Distribuidora Junín",type:"Distribuidor",location:"Concepción",tax:"20666777888",contact:"Ana Rojas",phone:"945 662 701",email:"ventas@distribuidorajunin.pe",channel:"Distribuidor",paymentTerms:"Crédito a 15 días",registeredAt:"05/03/2026",orders:2,status:"Activo"},
  ],
  products:[
    {id:"MP-001",name:"Papa Yungay",category:"Materia prima",unit:"kg",tracking:"Por lote",life:"30 días",stock:460},
    {id:"ING-001",name:"Aceite vegetal",category:"Ingrediente",unit:"L",tracking:"Por lote",life:"12 meses",stock:152},
    {id:"ING-002",name:"Sal",category:"Ingrediente",unit:"kg",tracking:"Por lote",life:"24 meses",stock:42},
    {id:"ENV-001",name:"Bolsa metalizada",category:"Envase",unit:"unidad",tracking:"Por lote",life:"—",stock:2400},
    {id:"ENV-002",name:"Botella 500 ml",category:"Envase",unit:"unidad",tracking:"Por lote",life:"—",stock:2500},
    {id:"ENV-003",name:"Tapa",category:"Envase",unit:"unidad",tracking:"Por lote",life:"—",stock:2500},
    {id:"ENV-004",name:"Etiqueta",category:"Envase",unit:"unidad",tracking:"Por lote",life:"—",stock:2500},
    {id:"PT-001",name:"Chips de papa de 100 g",category:"Producto terminado",unit:"bolsa",tracking:"Por lote",life:"6 meses",stock:670},
    {id:"PB-001",name:"Jugo base de mango",category:"Producto en proceso",unit:"L",tracking:"Por lote",life:"15 días",stock:15},
    {id:"PT-002",name:"Jugo de mango de 500 ml",category:"Producto terminado",unit:"botella",tracking:"Por lote",life:"9 meses",stock:1450},
  ],
  lots:[
    {id:"PAP-2026-001",product:"Papa Yungay",type:"Materia prima",qty:460,unit:"kg",location:"Frescos A-01",expiry:"18/08/2026",status:"Aprobado",origin:"REC-2026-001"},
    {id:"ACE-2026-001",product:"Aceite vegetal",type:"Ingrediente",qty:152,unit:"L",location:"Insumos I-02",expiry:"12/07/2027",status:"Aprobado",origin:"REC-2026-002"},
    {id:"SAL-2026-001",product:"Sal",type:"Ingrediente",qty:42,unit:"kg",location:"Insumos I-02",expiry:"12/07/2028",status:"Aprobado",origin:"REC-2026-003"},
    {id:"BOL-2026-001",product:"Bolsa metalizada",type:"Envase",qty:2400,unit:"unidad",location:"Envases E-01",expiry:"No aplica",status:"Aprobado",origin:"REC-2026-004"},
    {id:"BOT-2026-001",product:"Botella 500 ml",type:"Envase",qty:2500,unit:"unidad",location:"Envases E-01",expiry:"No aplica",status:"Aprobado",origin:"REC-2026-005"},
    {id:"TAP-2026-001",product:"Tapa",type:"Envase",qty:2500,unit:"unidad",location:"Envases E-01",expiry:"No aplica",status:"Aprobado",origin:"REC-2026-006"},
    {id:"ETQ-2026-001",product:"Etiqueta",type:"Envase",qty:2500,unit:"unidad",location:"Envases E-01",expiry:"No aplica",status:"Aprobado",origin:"REC-2026-007"},
    {id:"CHIP-2026-001",product:"Chips de papa de 100 g",type:"Producto terminado",qty:670,unit:"bolsas",location:"Terminados PT-01",expiry:"21/01/2027",status:"Disponible",origin:"OF-CHIPS-001"},
    {id:"BASE-MANGO-2026-001",product:"Jugo base de mango",type:"Producto en proceso",qty:15,unit:"L",location:"Tanque TQ-01",expiry:"06/08/2026",status:"Próximo a vencer",origin:"OF-PREP-001"},
    {id:"JM500-2026-001",product:"Jugo de mango de 500 ml",type:"Producto terminado",qty:1450,unit:"botellas",location:"Terminados PT-02",expiry:"23/04/2027",status:"Disponible",origin:"OF-ENV-001"},
  ],
  movements:[
    ["27/07/2026 09:10","PV-2026-024","Jugo de mango 500 ml","JM500-2026-001","PT-02 → Clientes","480 botellas","Preparado"],
    ["24/07/2026 08:41","ENT-2026-021","Chips de papa 100 g","CHIP-2026-001","PT-01 → Supermercado","300 bolsas","Entregado"],
    ["23/07/2026 08:15","OF-ENV-001","Jugo de mango 500 ml","JM500-2026-001","Envasado → PT-02","1,930 botellas","Terminado"],
    ["21/07/2026 16:22","OF-CHIPS-001","Chips de papa 100 g","CHIP-2026-001","Producción → PT-01","970 bolsas","Terminado"],
  ],
};
