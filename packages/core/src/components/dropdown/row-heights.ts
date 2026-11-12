/** 用树状数组维护动态行高，定位和更新均为 O(log n)。 */
export class RowHeights {
  private values: number[];
  private sums: number[];

  constructor(heights: number[]) {
    this.values = [...heights];
    this.sums = [0, ...heights];
    for (let i = 1; i < this.sums.length; i++) {
      const parent = i + (i & -i);
      if (parent < this.sums.length) this.sums[parent] += this.sums[i];
    }
  }

  offset(end: number): number {
    let sum = 0;
    for (let i = Math.min(end, this.values.length); i > 0; i -= i & -i)
      sum += this.sums[i];
    return sum;
  }

  set(index: number, height: number): boolean {
    if (
      index < 0 ||
      index >= this.values.length ||
      height <= 0 ||
      Math.abs(this.values[index] - height) < 0.5
    )
      return false;
    const delta = height - this.values[index];
    this.values[index] = height;
    for (let i = index + 1; i < this.sums.length; i += i & -i)
      this.sums[i] += delta;
    return true;
  }

  indexAt(offset: number): number {
    let index = 0;
    let sum = 0;
    let bit = 1;
    while (bit * 2 < this.sums.length) bit *= 2;
    for (; bit > 0; bit >>= 1) {
      const next = index + bit;
      if (next < this.sums.length && sum + this.sums[next] <= offset) {
        sum += this.sums[next];
        index = next;
      }
    }
    return Math.min(index, Math.max(0, this.values.length - 1));
  }
}
