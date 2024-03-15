/**
 * Prevent some vue data from been tracked by vue to avoid performance issue.
 *
 * @usage
 *  ```ts
 *  export default defineComponent({
 *      data() {
 *          return vueDataTrack({
 *              // Declare normal vue data.
 *              yes: {
 *                  someProp1: 0 as number,
 *                  someProp2: '' as string | null,
 *              },
 *              // Declare no track data.
 *              no: {
 *                  video: null as HTMLVideoElement | null,
 *                  chart: null as ECharts | null,
 *              }
 *          });
 *      },
 *      methods: {
 *          someMethod() {
 *              // Use `getNoTracked` to get the value of no-track data.
 *              const video = getNotTracked(this, 'video');
 *              // Visit tracked data as usual.
 *              const someValue = this.someProp1;
 *          }
 *      }
 *  },
 *  ```
 */
export function vueDataTrack<
    TTrackLiteral extends Record<string, unknown>,
    TNoTrackLiteral extends Record<string, unknown>,
>(
    input: {
        yes: TTrackLiteral,
        no: TNoTrackLiteral,
    }
): TTrackLiteral & addPrefixToKey<TNoTrackLiteral, '$_not_tracked_'> {
    // data that start with '_' or '$' will not be tracked by vue.
    // See https://v2.vuejs.org/v2/api/#data
    const result: Record<string, unknown> = {};
    Object.keys(input.yes || {}).forEach(key => {
        result[key] = input.yes[key];
    });
    Object.keys(input.no || {}).forEach(key => {
        result[`$_not_tracked_${key}`] = input.no[key];
    });
    return result as TTrackLiteral & addPrefixToKey<TNoTrackLiteral, '$_not_tracked_'>;
}

/**
 * @see vueDataTrack
 * @usage
 *  ```ts
 *  const chart = getNotTracked(this, 'chart');
 *  ```
 */
export function getNotTracked<
    TThat extends {[key in `$_not_tracked_${TAttr}`]: unknown},
    TAttr extends string
>(
    that: TThat,
    attr: TAttr
): TThat[`$_not_tracked_${TAttr}`] {
    return that[`$_not_tracked_${attr}`];
}

/**
 * @see vueDataTrack
 * @usage
 *  ```ts
 *  setNotTracked(this, 'chart', chart);
 *  ```
 */
export function setNotTracked<
    TThat extends {[key in `$_not_tracked_${TAttr}`]: unknown},
    TAttr extends string,
    TValue extends TThat[`$_not_tracked_${TAttr}`],
>(
    that: TThat,
    attr: TAttr,
    value: TValue
): TValue {
    return (that[`$_not_tracked_${attr}`] = value);
}

type addPrefixToKey<T, P extends string> = {
  [K in keyof T as K extends string ? `${P}${K}` : never]: T[K]
};
