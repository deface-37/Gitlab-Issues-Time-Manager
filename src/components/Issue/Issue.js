import templateText from './IssueTemplate.html';
const template = document.createElement('template')
template.innerHTML = templateText;

export default class IssueElement extends HTMLElement {
  /**
   * 
   * @param {object} issueInfo параметры задачи
   * @param {string} issueInfo.title - заголовок задачи
   * @param {string|number} issueInfo.spend - потраченное время
   * @param {string|number} issueInfo.estimated - оцененное время
   */
  constructor(issueInfo) {
    super();
    // Добавляем shadow dom
    const shadow = this.attachShadow({ mode: "open" });
    shadow.append(template.content.cloneNode(true));
    // Сохраняем узлы
    this._titleNode = shadow.querySelector('#title');
    this._spendNode = shadow.querySelector('#spend');
    this._estimatedNode = shadow.querySelector('#estimated');
    
    // Назначаем свойства
    this.dataset.title = issueInfo.title;
    this.dataset.spend = issueInfo.spend;
    this.dataset.estimated = issueInfo.estimated;
  }

  get title() {
    return this._titleNode.textContent;
  }
  set title(val) {
    this._titleNode.textContent = val;
  }

  get spendString() {
    return this._spendNode.textContent;
  }
  set spend(val) {
    this._spendNode.textContent = val;
  }

  get estimatedString() {
    return this._estimatedNode.textContent;
  }
  set estimated(val) {
    this._estimatedNode.textContent = val;
  }

  _render() {
    const { title, spend, estimated } = this.dataset
    
    if (title) {
      this.title = title
    }
    if (spend) {
      this.spend = this.spendString.replace(/\d+/, spend)
    }
    if (estimated) {
      this.estimated = this.estimatedString.replace(/\d+/, estimated)
    }
  }

  connectedCallback() {
    // this._render()
  }

  static get observedAttributes() {
    return ['data-spend', 'data-estimated', 'data-title']
  }

  attributeChangedCallback() {
    this._render()
  }
}



customElements.define('issue-element', IssueElement);

