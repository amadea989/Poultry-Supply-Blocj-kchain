/*
 * author: i. mitchell
 * date: 2019
 * license: you may use this as an educational resource, 
 * the author is not responsibility for any damage or lost this program may cause
*/
/*
 * User submits order to restaurant
 * @param {org.pqc.uk.placeOrder} placeOrder - pizza order
 * @transaction
 */
async function placeOrder(tx){
    const ns='org.kuku.net';
//create new order 
    var factory = getFactory();
    var newOrder=factory.newResource(ns,'order',tx.orderID);
    newOrder.pizza = tx.pizza;
    newOrder.restaurant = tx.restaurant;
    newOrder.consumer = tx.Customer;
    newOrder.status = 'PLACED';
// add new order to the order registry
    const orderReg = await getAssetRegistry(ns+'.order');
    await orderReg.add(newOrder);
}
/*
 * restaurant prepares order
 * @param {org.pqc.uk.prepareOrder} prepareOrder - pizza order
 * @transaction
 */
async function prepareOrder(tx){
    const ns='org.pqc.uk';
    currentOrder = tx.pizzaPrepared;
    if( currentOrder.status !== 'PLACED')
    {
        throw new Error('Current order'+currentOrder.orderID+' is in wrong status to be prepared');
    }
    else
    {
        currentOrder.status = 'PREPARED';
    }
// update order with currentOrder
    const orderReg = await getAssetRegistry(ns+'.order');
    await orderReg.update(currentOrder);
// emit the event
    const factory=getFactory();
    const prepareOrderEvent=factory.newEvent(ns,'prepareOrderEvent');
    prepareOrderEvent.pizzaPrepared=currentOrder;
    emit(prepareOrderEvent);
}
/*
 * restaurant dispatches order
 * @param{org.pqc.uk.dispatchOrder} dispatchOrder - pizza dispatched
 * @transaction
 */
async function dispatchOrder(tx){
    const ns='org.pqc.uk';
    currentOrder=tx.pizzaDispatched;
    if( currentOrder.status !== 'PREPARED')
    {
        throw new Error('Current order has not been prepared');
    }
    else
    {
        currentOrder.status = 'DISPATCHED';
    }
// update order with currentOrder
    const orderReg = await getAssetRegistry(ns+'.order');
    await orderReg.update(currentOrder);
// emit the event
    const factory=getFactory();
    const dispatchOrderEvent=factory.newEvent(ns,'dispatchOrderEvent');
    dispatchOrderEvent.pizzaDispatched = currentOrder;
    emit(dispatchOrderEvent);
}
/*
 * customer receives order
 * @param{org.pqc.uk.deliverOrder} deliverOrder - pizza delivered
 * @transaction
 */
async function deliverOrder(tx){
    const ns='org.pqc.uk';
    currentOrder=tx.pizzaDelivered;
    if( currentOrder.status !== 'DISPATCHED') 
    {
        throw new Error('Current order has not been dispatched');
    }
    else
    {
        currentOrder.status = 'DELIVERED';
    }
// update order with currentOrder
    const orderReg = await getAssetRegistry(ns+'.order');
    await orderReg.update(currentOrder);
// emit the event
    const factory=getFactory();
    const deliverOrderEvent=factory.newEvent(ns,'deliverOrderEvent');
    deliverOrderEvent.pizzaDelivered=currentOrder;
    emit(deliverOrderEvent);
}