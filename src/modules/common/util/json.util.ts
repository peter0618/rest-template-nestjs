export class JsonUtil {
  static clearNull(data) {
    if (data == null) {
      return data;
    }

    const result = {};

    Object.keys(data).forEach(key => {
      if (data[key] !== null) {
        if (data[key].constructor === Array) {
          result[key] = [];
          for (let i = 0; i < data[key].length; i++) {
            if (data[key][i]) {
              result[key][i] = JsonUtil.clearNull(data[key][i]);
            }
          }
        } else if (typeof data[key] === 'object') {
          result[key] = JsonUtil.clearNull(data[key]);
        } else {
          result[key] = data[key];
        }
      }
    });

    return result;
  }

  static log(data) {
    return JSON.stringify(JsonUtil.clearNull(data));
  }

  static snakeToCamelCase(obj) {
    if (typeof obj === 'string') {
      return JsonUtil.snakeToCamel(obj);
    }

    return JsonUtil.traverse(obj, JsonUtil.snakeToCamel);
  }

  static camelToSnakeCase(obj, options = {}) {
    if (!JsonUtil.isSimpleObject(options)) {
      return obj; // avoiding String and other custom objects
    }

    if (typeof obj === 'string') {
      return JsonUtil.camelToSnake(obj, options);
    }

    return JsonUtil.traverse(obj, JsonUtil.camelToSnake, options);
  }

  static traverse(obj, transform, options = {}) {
    if (!obj) {
      return obj;
    }

    if (typeof obj !== 'object') {
      return obj; // must be an object
    }

    if (JsonUtil.isArray(obj)) {
      return obj.map(el => JsonUtil.traverse(el, transform, options));
    }

    if (!JsonUtil.isSimpleObject(obj)) {
      return obj; // avoiding String and other custom objects
    }

    return Object.keys(obj).reduce((acc, key) => {
      const convertedKey = transform(key, options);
      acc[convertedKey] = JsonUtil.traverse(obj[key], transform, options);
      return acc;
    }, {});
  }

  static isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  }

  static isSimpleObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
  }

  static snakeToCamel(str) {
    return str.replace(/[_-](\w|$)/g, (match, value) => value.toUpperCase());
  }

  static camelToSnake(str, options) {
    const firstPass = str.replace(/[a-z][A-Z]/g, letters => `${letters[0]}_${letters[1].toLowerCase()}`);
    if (options.digitsAreUpperCase) {
      return firstPass.replace(/[0-9]/g, digit => `_${digit}`);
    }

    return firstPass;
  }
}

/**
 * object 의 circular 해결하고 json string 을 반환합니다.
 * @param obj
 */
const uncirculate = (obj: object): string => {
  // Note: cache should not be re-used by repeated calls to JSON.stringify.
  let cache = [];
  const result = JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Duplicate reference found, discard key
        return;
      }
      // Store value in our collection
      cache.push(value);
    }
    return value;
  });
  cache = null; // Enable garbage collection

  return result;
};

export default {
  uncirculate,
};
