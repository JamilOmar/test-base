export class ObjectUtils {
    public static isFunction(obj: () => unknown) {
        return !!(obj && obj.constructor && obj.call && obj.apply);
    }

    public static reorderArray<T = unknown>(value: T[], from: number, to: number) {
        if (value && from !== to) {
            if (to >= value.length) {
                to %= value.length;
                from %= value.length;
            }
            value.splice(to, 0, value.splice(from, 1)[0]);
        }
    }

    public static insertIntoOrderedArray<T = unknown>(item: T, index: number, arr: T[], sourceArr: T[]): void {
        if (arr.length > 0) {
            let injected = false;
            for (let i = 0; i < arr.length; i++) {
                const currentItemIndex = this.findIndexInList(arr[i], sourceArr);
                if (currentItemIndex > index) {
                    arr.splice(i, 0, item);
                    injected = true;
                    break;
                }
            }

            if (!injected) {
                arr.push(item);
            }
        } else {
            arr.push(item);
        }
    }

    public static findIndexInList<T = unknown>(item: T, list: T[]): number {
        let index = -1;

        if (list) {
            for (let i = 0; i < list.length; i++) {
                if (list[i] === item) {
                    index = i;
                    break;
                }
            }
        }

        return index;
    }
}
