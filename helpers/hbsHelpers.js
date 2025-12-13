import sections from 'express-handlebars-sections';
import dayjs from 'dayjs';

export default {
    section: sections(),
    eq: (a, b) => {
        return a === b;
    },
    ifEquals: function (a, b, options) {
        return a === b ? options.fn(this) : options.inverse(this);
    },
    ifCond: function (v1, v2, options) {
        return v1 === v2 ? options.fn(this) : options.inverse(this);
    },
    formatDate: (date, format) => {
      return dayjs(date).format(format);
    },
    json: (context) => {
      return JSON.stringify(context);
    },
    ifActive: (path, options) => {
      return (path === options.data.root.currentPath) ? 'active' : '';
    },
    ifActivePrefix: (currentPath, prefix, options) => {
      return currentPath.startsWith(prefix) ? options.fn(this) : options.inverse(this);
    }
}