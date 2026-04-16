function test(a, b) {
    var x = a + b; // 2+4 = 6
    if (x > 10) {
        console.log("besar");
    } else {
        console.log("kecil");
    }

    for (var i = 0; i < 5; i++) {
        x += i;
        console.log(i, x)
    }
    return {
        x: x,
        valid: x > 10
    }
}
let data = [1, 2, 3, 4];
data.map(function(n) {
    return n * 2
}).forEach(function(v) {
    console.log(v)
})
const dataa = test(2,4);

console.log(dataa.x);
console.log(dataa.valid);




const initialDataMinuman = ['nama', 'harga']
const minuman = {initialDataMinuman}

const satu = {'nama': 'mie aceh', 'harga': 12000}
const dua = {'nama': 'mie tiaw', 'harga': 12000}
const tiga = {'nama': 'mie rebus', 'harga': 12000}
const empat = {'nama': 'ayam penyet', 'harga': 12000}
const lima = {'nama': 'ayam geprek', 'harga': 12000}

const initialDataMakanan = {'nama': '', 'harga': ''}
const makanan = initialDataMakanan;
const initialDataClient = [makanan]
const dataClient = initialDataClient
console.log('daata', dataClient);

let dattt = [{...dataClient[0], 'nama': 'nasi goreng'}];
dattt = [...dattt, satu, dua, tiga, empat, lima]

dattt.map((item, index) => index === 0 ? { ...item, harga: 20000 } : item)
dattt = dattt.map((item, index) =>
  index === 0
    ? { ...item, harga: 20000 }
    : item
);


console.log('daata', dattt)


// dattt = [...dattt, {dattt[0][harga]: 20000}]
/*
daata [
  { nama: 'nasi goreng', harga: '' }, ---> harusnya harag nya keisi
  { nama: 'mie aceh', harga: 12000 },
  { nama: 'mie tiaw', harga: 12000 },
  { nama: 'mie rebus', harga: 12000 },
  { nama: 'ayam penyet', harga: 12000 },
  { nama: 'ayam geprek', harga: 12000 },
  { nama: 'nasi goreng', harga: 20000 } ---> kenapa nambah ?
]
*/
