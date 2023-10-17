const setCookie = (value) => {
    document.cookie = `item=${JSON.stringify(value)};expires=${new Date(new Date().setDate(new Date().getDate() + 365)).toUTCString()};path=/;secure;samesite=lax`;

    return document.cookie;
};

const getCookie = () => {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());

    for (const cookie of cookies) {
        const [name, value] = cookie.split("=");

        if (name === "item") {
            const array = JSON.parse(value);

            for (let i = 0; i < array.length; i++) {
                const list = document.getElementById('list');
                const template = `
                  <li id="${array[i].id}" data-action="choose">
                    <p>${array[i].title}</p>
                    <button type="button" name="save_item" class="save_cookie_btn" data-action="save_to_cookie"><i class="fa-regular fa-square-check"></i>Save</button>
                    <button type="button" name="delete_item" class="delete_item_btn" data-action="delete"><i class="fa-solid fa-circle-xmark"></i>Delete</button>
                  </li>
                  `;

                list.insertAdjacentHTML('afterbegin', template);
            };

            return list;
        };
    };

    return [];
};

const clearCookie = () => {
    const cookie = document.cookie.split(';');

    !!cookie && cookie.forEach((c) => {
        document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/');
    });
};

export { setCookie, getCookie, clearCookie };
