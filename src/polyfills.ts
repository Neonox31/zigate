// interface Array<T> {
//   flatMap<E>(callback: (t: T) => Array<E>): Array<E>
// }
//
// Object.defineProperties(Array.prototype, {
//   flatMap: {
//     value: function(lambda: any) {
//       return Array.prototype.concat.apply([], this.map(lambda))
//     },
//     writeable: false,
//     enumerable: false
//   }
// })
