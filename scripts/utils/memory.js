const Memory = {

    get:  k => localStorage.getItem(k),
    set:  (k, v) => localStorage.setItem(k, v),

    getJson: k => {
        const item = localStorage.getItem(k);
        return item ? JSON.parse(item) : null;
    },
    setJson: (k, v) => {
        localStorage.setItem(k, JSON.stringify(v));
    }

}


export default Memory;