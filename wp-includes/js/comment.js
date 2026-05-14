var api =  'https://script.google.com/macros/s/AKfycby7kvFa2kU-_h3bDiK3csRXy99W2j2ElSuKTPdSuq6ASud6QNIwdASPvn4KEgVtmP79/exec';

export const comentarService = {
    getComentar: async function () {
    try {
        const res = await fetch(api);
        const result = await res.json();

        // console.log("API RAW:", result);

        // 🔥 langsung return array saja
        return Array.isArray(result.comentar) ? result.comentar : [];

    } catch (err) {
        console.error("GET ERROR:", err);
        return [];
  }
    },

    addComentar: async function ({id, name, status, message, date, color}) {
        const comentar = {
            id: id,
            name: name,
            status: status,
            message: message,
            date: date,
            color: color,
        };

        try {
            const response = await fetch(api, {
                method: 'POST',
                mode: 'no-cors', // WAJIB
                body: JSON.stringify(comentar),
            });

            // return await response.json();
             return { success: true };

        } catch (error) {
            console.error('Post error:', error);
            return {error: error.message};
        }
    },
};