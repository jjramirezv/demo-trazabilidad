import { createContext, useContext, useEffect, useReducer } from "react";
import { seed } from "../data/seed";

const initial = {
  model:"manufacturer", purchase:"confirmed", receipt:"quality", manufacturing:"ready",
  packaging:"ready", sale:"draft", incident:false, recallStep:1,
  suppliers:seed.suppliers, customers:seed.customers, products:seed.products, recipes:seed.recipes, purchaseOrders:seed.purchaseOrders, receipts:seed.receipts, productionOrders:seed.productionOrders, packagingOrders:seed.packagingOrders, salesOrders:seed.salesOrders, deliveries:seed.deliveries, lots:seed.lots,
};
function reducer(state, action) {
  switch(action.type) {
    case "MODEL": return {...state,model:action.value};
    case "PURCHASE": return {...state,purchase:action.value};
    case "RECEIPT": return {...state,receipt:action.value};
    case "MANUFACTURING": return {...state,manufacturing:action.value};
    case "PACKAGING": return {...state,packaging:action.value};
    case "SALE": return {...state,sale:action.value};
    case "INCIDENT": return {...state,incident:action.value,lots:state.lots.map(l=>l.id==="ACE-2026-001"?{...l,status:action.value?"Bloqueado":"Aprobado"}:l)};
    case "RECALL_STEP": return {...state,recallStep:action.value};
    case "ADD": return {...state,[action.collection]:[...state[action.collection],action.value]};
    case "UPDATE": return {...state,[action.collection]:state[action.collection].map(item=>item.id===action.value.id?action.value:item)};
    case "CONFIRM_PURCHASE": {
      const order=state.purchaseOrders.find(item=>item.id===action.id);
      return {
        ...state,
        purchaseOrders:state.purchaseOrders.map(item=>item.id===action.id?{...item,status:"Confirmado"}:item),
        receipts:order&&!state.receipts.some(item=>item.purchaseId===order.id)?[...state.receipts,receiptFromOrder(order,state.receipts)]:state.receipts,
      };
    }
    case "COMPLETE_RECEIPT": {
      const receipt=action.value;
      const lotExists=state.lots.some(lot=>lot.id===receipt.lotId);
      const newLot={id:receipt.lotId,product:receipt.product,type:productType(state.products,receipt.product),qty:Number(receipt.approvedQty),unit:receipt.unit,location:receipt.destination,expiry:receipt.expiry,status:Number(receipt.approvedQty)>0?"Aprobado":"Rechazado",origin:receipt.id,reserved:0};
      return {...state,receipts:state.receipts.map(item=>item.id===receipt.id?receipt:item),lots:receipt.approvedQty>0&&!lotExists?[...state.lots,newLot]:state.lots};
    }
    case "SET_RECEIPTS": return {...state,receipts:action.value};
    case "SET_LOTS": return {...state,lots:action.value};
    case "SET_RESERVATIONS": return {...state,lots:action.value};
    case "ADVANCE_PRODUCTION": return {...state,productionOrders:state.productionOrders.map(order=>order.id===action.id?{...order,status:action.status}:order)};
    case "COMPLETE_PRODUCTION": {
      const order=action.value;
      const consumed=state.lots.map(lot=>{const component=order.components.find(item=>item.lotId===lot.id);return component?{...lot,qty:Math.max(0,Number(lot.qty)-Number(component.qty))}:lot});
      const exists=consumed.some(lot=>lot.id===order.outputLotId);
      const output={id:order.outputLotId,product:order.product,type:"Producto terminado",qty:Number(order.producedQty),unit:order.unit,location:"Terminados PT-01",expiry:order.expiry,status:"Disponible",origin:order.id,reserved:0};
      return {...state,productionOrders:state.productionOrders.map(item=>item.id===order.id?order:item),lots:exists?consumed:[...consumed,output]};
    }
    case "ADVANCE_PACKAGING": return {...state,packagingOrders:state.packagingOrders.map(order=>order.id===action.id?{...order,status:action.status}:order)};
    case "COMPLETE_PACKAGING": {
      const order=action.value;
      let nextLots=state.lots.map(lot=>{const component=order.components.find(item=>item.lotId===lot.id);return component?{...lot,qty:Math.max(0,Number(lot.qty)-Number(component.qty))}:lot});
      const existing=nextLots.find(lot=>lot.id===order.outputLotId);
      if(existing)nextLots=nextLots.map(lot=>lot.id===order.outputLotId?{...lot,qty:Number(order.producedQty),expiry:order.expiry,origin:order.id,status:"Disponible"}:lot);
      else nextLots=[...nextLots,{id:order.outputLotId,product:order.product,type:"Producto terminado",qty:Number(order.producedQty),unit:order.unit,location:"Terminados PT-02",expiry:order.expiry,status:"Disponible",origin:order.id,reserved:0}];
      return {...state,packagingOrders:state.packagingOrders.map(item=>item.id===order.id?order:item),lots:nextLots};
    }
    case "CONFIRM_SALE": {
      const order=state.salesOrders.find(item=>item.id===action.id);
      const deliveryExists=state.deliveries.some(item=>item.salesOrderId===action.id);
      const sequence=Math.max(0,...state.deliveries.map(item=>Number(item.id.split("-").at(-1))||0))+1;
      const customer=state.customers.find(item=>item.id===order.customerId);
      const delivery={id:`DES-2026-${String(sequence).padStart(3,"0")}`,salesOrderId:order.id,customerId:order.customerId,customer:order.customer,product:order.product,lotId:order.lotId,qty:order.qty,unit:order.unit,deliveryDate:order.deliveryDate,destination:customer?.location||"",carrier:"",vehicle:"",guideNumber:"",receivedBy:"",status:"Pendiente"};
      return {...state,salesOrders:state.salesOrders.map(item=>item.id===action.id?{...item,status:"Confirmado"}:item),lots:state.lots.map(lot=>lot.id===order.lotId?{...lot,reserved:Number(lot.reserved||0)+Number(order.qty)}:lot),deliveries:deliveryExists?state.deliveries:[...state.deliveries,delivery]};
    }
    case "COMPLETE_DELIVERY": {
      const delivery=action.value;
      return {...state,deliveries:state.deliveries.map(item=>item.id===delivery.id?delivery:item),salesOrders:state.salesOrders.map(item=>item.id===delivery.salesOrderId?{...item,status:"Entregado"}:item),lots:state.lots.map(lot=>lot.id===delivery.lotId?{...lot,qty:Math.max(0,Number(lot.qty)-Number(delivery.qty)),reserved:Math.max(0,Number(lot.reserved||0)-Number(delivery.qty))}:lot)};
    }
    case "TRANSFER_LOT": return {
      ...state,
      lots:state.lots.map(lot=>lot.id===action.value.lotId?{...lot,location:action.value.destination}:lot),
      inventoryMovements:[action.value,...(state.inventoryMovements||[])],
    };
    case "RESET": return initial;
    default:return state;
  }
}
const Context=createContext(null);
export function DemoProvider({children}) {
 const [state,dispatch]=useReducer(reducer,initial,s=>{
  try {
   const saved=JSON.parse(localStorage.getItem("agrotrace-v7"));
   if(!saved)return s;
   return {
    ...s,
    ...saved,
    suppliers:Array.isArray(saved.suppliers)?saved.suppliers:s.suppliers,
    customers:Array.isArray(saved.customers)?saved.customers:s.customers,
    products:Array.isArray(saved.products)?mergeRecords(s.products,saved.products):s.products,
    recipes:Array.isArray(saved.recipes)?saved.recipes:s.recipes,
    purchaseOrders:Array.isArray(saved.purchaseOrders)?saved.purchaseOrders:s.purchaseOrders,
    receipts:ensureReceipts(Array.isArray(saved.purchaseOrders)?saved.purchaseOrders:s.purchaseOrders,Array.isArray(saved.receipts)?saved.receipts:s.receipts),
    productionOrders:Array.isArray(saved.productionOrders)?mergeRecords(s.productionOrders,saved.productionOrders):s.productionOrders,
    packagingOrders:Array.isArray(saved.packagingOrders)?mergeRecords(s.packagingOrders,saved.packagingOrders):s.packagingOrders,
    salesOrders:Array.isArray(saved.salesOrders)?mergeRecords(s.salesOrders,saved.salesOrders):s.salesOrders,
    deliveries:Array.isArray(saved.deliveries)?mergeRecords(s.deliveries,saved.deliveries):s.deliveries,
    lots:Array.isArray(saved.lots)?saved.lots:s.lots,
    inventoryMovements:Array.isArray(saved.inventoryMovements)?saved.inventoryMovements:[],
   };
  } catch {
   return s;
  }
 });
 useEffect(()=>{
  const ensured=ensureReceipts(state.purchaseOrders||[],state.receipts||[]);
  if(ensured.length!==(state.receipts||[]).length)dispatch({type:"SET_RECEIPTS",value:ensured});
 },[state.purchaseOrders,state.receipts]);
 useEffect(()=>{
  const merged=mergeRecords(seed.lots,state.lots||[]);
  if(merged.length!==(state.lots||[]).length)dispatch({type:"SET_LOTS",value:merged});
 },[state.lots]);
 useEffect(()=>{
  const expected=new Map();
  (state.salesOrders||[]).filter(order=>order.status==="Confirmado").forEach(order=>expected.set(order.lotId,(expected.get(order.lotId)||0)+Number(order.qty)));
  const changed=(state.lots||[]).some(lot=>Number(lot.reserved||0)!==Number(expected.get(lot.id)||0));
  if(changed)dispatch({type:"SET_RESERVATIONS",value:state.lots.map(lot=>({...lot,reserved:Number(expected.get(lot.id)||0)}))});
 },[state.salesOrders,state.lots]);
 useEffect(()=>localStorage.setItem("agrotrace-v7",JSON.stringify(state)),[state]);
 return <Context.Provider value={{state,dispatch}}>{children}</Context.Provider>;
}
export const useDemo=()=>useContext(Context);

function receiptFromOrder(order,receipts=[]){
 const sequence=Math.max(0,...receipts.map(item=>Number(item.id.split("-").at(-1))||0))+1;
 return {id:`REC-2026-${String(sequence).padStart(3,"0")}`,purchaseId:order.id,supplier:order.supplier,product:order.product,requestedQty:order.qty,unit:order.unit,expectedDate:order.expectedDate,receivedQty:"",approvedQty:"",rejectedQty:"",supplierLot:"",expiry:"",destination:"",appearance:"Pendiente",packaging:"Pendiente",documentation:"Pendiente",notes:"",lotId:"",status:"Pendiente de recepción"};
}
function ensureReceipts(orders,receipts){const next=[...receipts];orders.filter(order=>order.status==="Confirmado").forEach(order=>{if(!next.some(item=>item.purchaseId===order.id))next.push(receiptFromOrder(order,next))});return next}
function productType(products,name){return products.find(item=>item.name===name)?.category||"Materia prima"}
function mergeRecords(base,current){const byId=new Map(base.map(item=>[item.id,item]));current.forEach(item=>byId.set(item.id,item));return [...byId.values()]}
