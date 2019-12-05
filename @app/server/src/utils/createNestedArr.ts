export default function createNestedArr(flatArr: any, batchSize: number) {
  const nestedArr: any = [];
  let arrIndex = -1;

  flatArr.forEach((element: any, index: number) => {
    // if divisble by batchsize it's time for a new batch
    if (index % batchSize === 0) {
      nestedArr.push([]);
      arrIndex++;
    }
    nestedArr[arrIndex].push(element);
  });

  return nestedArr;
}
