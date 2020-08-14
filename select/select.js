const getTemplate = (data = [], placeholder, selectedId) => {
    let text = placeholder ?? "Текст по умолчанию";

    const items = data.map((item) => {
        let cls = "";
        if (item.id === selectedId) {
            text = item.value;
            cls = "selected"
        }
        return`
            <li class="select__item ${cls}" data-type="item" data-id="${item.id}">${item.value}</li>
        `
    })

    return `
    <div class="select__backdrop" data-type="backdrop"></div>
        <div class="select__input" data-type="input">
            <span data-type="value">${text}</span>
            <i class="fas fa-chevron-down" data-type="arrow"></i>
        </div>
        <div id="scroll"  class="select__dropdown">
                ${items.join("")}
            </ul>
        </div>
    `;
}

export class Select {
    constructor(selector, options) {
        //$el - dom elem
        this.$el = document.querySelector(selector);
        
        this.options = options;
        this.selectedId = options.selectedId;

        this.#render();//render контетнта
        this.#setup();
    };

    #render() {//функция для рендера контента selecta
        const { placeholder, data } = this.options
        this.$el.classList.add("select")
        this.$el.innerHTML = getTemplate(data, placeholder, this.selectedId);
    };

    #setup() {
        this.clickHandler = this.clickHandler.bind(this);
        this.$el.addEventListener("click", this.clickHandler);
        // this.
        this.$arrow = this.$el.querySelector('[data-type="arrow"]');
        this.$value = this.$el.querySelector('[data-type="value"]');
    };

    clickHandler(event) {
        const { type } = event.target.dataset;
        // console.log("target", event.target);
        // console.log("dataset", event.target.dataset);
        
        if (type === "input") {
            this.toggle();
        } else if (type === "item") {
            const id = event.target.dataset.id;
            this.select(id);
        } else if (type === "backdrop") {
            this.close()
        }
        this.$scrollElem.classList.remove("scroll");
    };

    get isOpen() {
        return this.$el.classList.contains("open");
    };

    get current() {
        return this.options.data.find(item => item.id === this.selectedId);
    };

    select(id) {
        this.selectedId = id;
        this.$value.textContent = this.current.value;
        this.$el.querySelectorAll('[data-type="item"]').forEach(elem => {
            elem.classList.remove("selected");
        });// чистим окраску выбранных элементов
        this.$el.querySelector(`[data-id="${id}"]`).classList.add("selected");// строчка для окраски нашего выбранного элемента
        this.options.onSelect ? this.options.onSelect(this.current) : null;//вызов callbacka котрый мы получили из options
    };
    
    initialScrollBar() {
        this.$scrollElem = document.querySelector("#scroll");// получение дроп дауна
        this.$scrollElem.addEventListener("scroll", () => {// навешивание события прокрутки
            this.$scrollElem.classList.add("scroll");//добавление скроллбара
        })
    }

    toggle() {
        this.isOpen ? this.close() : this.open(); this.initialScrollBar();
    };

    open() {
        this.$el.classList.add("open");
        this.$arrow.classList.remove("fa-chevron-down");
        this.$arrow.classList.add("fa-chevron-up");
    };

    close() {
        this.$el.classList.remove("open");
        this.$arrow.classList.remove("fa-chevron-up");
        this.$arrow.classList.add("fa-chevron-down");
    };

    destroy() {
        this.$el.removeEventListener('click', this.clickHandler);
        this.$el.innerHTML = "";
    };
};