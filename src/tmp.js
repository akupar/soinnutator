const input = new Queue(['Burt', 'Hank', 'Tanya', 'Bertil'], { name: 'input' });
const vec = new Vector([8, 3, 9, 2, 3, 4, 5, 20], { name: 'vec' });
const st = new Stack({ name: 'st' });
const dic = new Dict({ name: 'dic' });
const hp = new Heap({ name: 'hp' }, (a, b) => a.priority - b.priority);

dic['x'] = 9;
dic['y'] = 'banana';

while ( input.length > 0 ) {
    const customer = input.dequeue();
    const priority = vec[input.length]
    hp.insert({ name: customer, priority });
}


while ( hp.length > 0 ) {
    st.push(hp.extract());
}

vars.sum = 0;
while ( st.length > 0 ) {
    vars.sum += st.pop();
}
