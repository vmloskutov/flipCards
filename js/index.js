
class CreateCard extends React.Component {
  constructor() {
    super();
    //создаем state у карточки
    this.state = {
      word: '',
      Translation: '',
      showError: false };

  }

  hideError() {
    this.setState({ showError: !this.state.showError });
  }

  render() {
    //Если ничего не введено
    const errorMessage = this.state.showError ? 'Please fill in the word and Translation!' : '';
    return (
      React.createElement("div", { className: "create-card" },
      React.createElement("div", {
        className: "create-card__shadow",
        onClick: () => {
          this.props.onShadowClick();
        } }),


      React.createElement("div", { className: "create-card__body" },
      React.createElement("h1", null, "Create New Card"),
      React.createElement("div", { className: "create-card__input-wrapper" },

      React.createElement("input", { //Ввод слова
        id: "word",
        placeholder: "Word",
        value: this.state.word,
        onChange: e => this.setState({ word: e.target.value }) }),

      React.createElement("input", { //Ввод перевода
        id: "Translation",
        placeholder: "Translation",
        value: this.state.Translation,
        onChange: e => this.setState({ Translation: e.target.value }) }),

      React.createElement("br", null),
      React.createElement("button", {
        id: "create-card__button",
        onClick: () => {
          if (this.state.word.length === 0 || this.state.Translation.length === 0) {
            this.setState({ showError: !this.state.showError });
            setTimeout(() => this.hideError(), 2000);
          } else {
            this.props.onShadowClick();
            const word = new Immutable.Map({ word: this.state.word, Translation: this.state.Translation });
            this.props.onCreateCard(word);
          }
        } }, "Create"),
      React.createElement("div", { className: "create-card__error" },
      errorMessage)))));
  }}


class Header extends React.Component {
  constructor() {
    super();
    this.state = {
      showModal: false };
  }
  render() {
    return (
      React.createElement("div", { className: "header" },
      React.createElement("div", { className: "header-content header-content__left" }),
      React.createElement("div", { className: "header-content header-content__middle" }, "Flipping Cards"),
      React.createElement("div", { className: "header-content header-content__right" })));
  }}

class Card extends React.Component {
  constructor() {
    super();
    this.state = {
      showAnswer: false }; // Сначала показывать перевод или слово
  }

  render() {
    const content = this.state.showAnswer ? this.props.backContent : this.props.frontContent;
    const iconClass = this.state.showAnswer ? 'reply' : 'share';
    const cardClass = this.state.showAnswer ? 'back' : '';
    const contentClass = this.state.showAnswer ? 'back' : 'front';
    const actionClass = this.state.showAnswer ? 'active' : '';

    return (
      React.createElement("div", {
        className: `card ${cardClass}`,
        onClick: () => this.setState({ showAnswer: !this.state.showAnswer }) },

      React.createElement("span", { className: "card__counter" }, this.props.cardNumber + 1),
      React.createElement("div", {
        className: "card__flip-card",
        onClick: () => {
          this.setState({ showAnswer: !this.state.showAnswer });
        } },


      React.createElement("span", { className: `fa fa-${iconClass}` })),

      React.createElement("div", { className: `card__content--${contentClass}` },
      content),

      React.createElement("div", { className: `card__actions ${actionClass}` },
      React.createElement("div", {
        className: "card__prev-button",
        onClick: () => {
          this.props.showPrevCard();
          this.setState({ showAnswer: false });
        } }, "Prev"),



      React.createElement("div", {
        className: "card__next-button",
        onClick: () => {
          this.props.showNextCard();
          this.setState({ showAnswer: false });
        } }, "Next"))));
  }}


class CardContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      cards: Immutable.fromJS([{
        word: 'Hello',
        Translation: 'Здравствуйте' },
      ]),


      cardNumber: 0 };

    this.boundCallback = this.hideCreateCard.bind(this);
    this.boundCreateCard = this.setCard.bind(this);
    this.boundShowPrevCard = this.showPrevCard.bind(this);
    this.boundShowNextCard = this.showNextCard.bind(this);
  }

  hideCreateCard() {
    this.setState({ showModal: false });
  }

  showNextCard() {
    if (this.state.cardNumber + 1 !== this.state.cards.size) {
      this.setState({ cardNumber: this.state.cardNumber += 1 });
    }
  }

  showPrevCard() {
    if (this.state.cardNumber !== 0) {
      this.setState({ cardNumber: this.state.cardNumber -= 1 });
    }
  }

  setCard(card) {
    const newCards = this.state.cards.push(card);
    this.setState({ cards: newCards });
  }

  generateDots() {
    const times = this.state.cards.size;
    let arr = [];
    _.times(times).forEach(num => {
      const dotClass = num === this.state.cardNumber ? 'active' : '';
      arr.push(
      React.createElement("span", {
        className: `card-container__dot fa fa-circle ${dotClass}`,
        onClick: () => this.setState({ cardNumber: num }) }));


    });
    return arr;
  }

  generateCards() {
    const cards = this.state.cards;
    const cardsList = cards.map(card => {
      return (
        React.createElement(Card, {
          frontContent: card.get('word'),
          backContent: card.get('Translation'),
          showNextCard: this.boundShowNextCard,
          showPrevCard: this.boundShowPrevCard,
          cardNumber: this.state.cardNumber }));
    });
    return cardsList.toJS()[this.state.cardNumber];
  }
  render() {
    return (
      React.createElement("div", null,
      React.createElement("span", {
        className: "card-container__icon  fa fa-plus",
        onClick: () => {
          this.setState({ showModal: !this.state.showModal });
        } }),

      this.state.showModal ?
      React.createElement(CreateCard, {
        onShadowClick: this.boundCallback,
        onCreateCard: this.boundCreateCard }) :

      '',
      this.generateCards(),
      React.createElement("div", { className: "card-container__dots-wrapper" },
      this.generateDots())));



  }}


class Main extends React.Component {
  render() {
    return (
      React.createElement("div", { className: "wrapper" },
      React.createElement(Header, null),
      React.createElement("div", { className: "content-wrapper" },
      React.createElement(CardContainer, null))));



  }}


ReactDOM.render(React.createElement(Main, null), document.getElementById('app'));
