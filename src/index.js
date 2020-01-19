import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';

const SEARCH_BUTTON_TEXT_DEFAULT = '検索';
const SEARCH_BUTTON_TEXT_RUNNING = '検索中...';

class InputArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: this.props.value}
        this.onChange = this.onChange.bind(this)
    }

    onChange(e) {
        this.setState({ value: e.target.value });
    }

    render() {
        return (
            <form className="uk-grid-small uk-grid">
                <div className="uk-width-1-2@s">
                    <textarea
                        value={this.state.value}
                        onChange={this.onChange}
                        className="uk-textarea"
                        cols="10" rows="15">
                    </textarea>
                </div>
            </form>
        );
    }
}

class SearchButton extends React.Component {
    render() {
        return (
            <button onClick={this.props.onClick(this)} disabled={this.props.disabled}>
                {this.props.value}
            </button>
        );
    }
}

class Search extends React.Component {
    render() {
        return (
            <div>
                <h1>著者検索</h1>
                <InputArea value={this.props.inputText} />
                <SearchButton
                    value={this.props.searchButtonText}
                    disabled={this.props.searchButtonDisabled}
                    onClick={this.props.onClick}
                />
            </div>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputText: '実験思考\n結局人生はアウトプットで決まる',
            searchButtonText: SEARCH_BUTTON_TEXT_DEFAULT,
            searchButtonDisabled : false,
            result: '',
        };
    }

    handleClick(e) {
        let searchButtonText = e.target.innerHTML === SEARCH_BUTTON_TEXT_DEFAULT ?
            SEARCH_BUTTON_TEXT_RUNNING : SEARCH_BUTTON_TEXT_DEFAULT;
        this.setState({
            searchButtonText: searchButtonText,
            searchButtonDisabled: !e.target.disabled,
            result: '',
        });
        let titles = this.state.inputText.split('\n');
        titles.forEach(title => this.search(title));
        e.preventDefault();
    }

    search(title) {
        fetch('https://www.googleapis.com/books/v1/volumes?q=' + title)
        .then(res => res.json())
        .then(
            (json) => {
                let item = json.items[0];
                let author = item.volumeInfo.authors.pop();
                let category = item.volumeInfo.categories.pop();
                let result = title + '\t' + author + '\t' + category + '\n';

                this.setState({
                    searchButtonText: SEARCH_BUTTON_TEXT_DEFAULT,
                    searchButtonDisabled: false,
                    result: this.state.result + result,
                });
            },
            (error) => {
                this.setState({
                    searchButtonText: SEARCH_BUTTON_TEXT_DEFAULT,
                    searchButtonDisabled: false
                });
            }
        )
    }

    render() {
        return (
            <div>
                <Search
                    inputText={this.state.inputText}
                    searchButtonText={this.state.searchButtonText}
                    searchButtonDisabled={this.state.searchButtonDisabled}
                    onClick={() => this.handleClick.bind(this)}
                />
                <hr />
                <Result result={this.state.result}/>
            </div>
        );
    }
}

class Result extends React.Component {
    render() {
        return (
            <div>
                <h1>結果</h1>
                <ResultTextArea value={this.props.result} />
            </div>
        );
    }
}

class ResultTextArea extends React.Component {
    render() {
        return(
            <form className="uk-grid-small uk-grid">
                <div className="uk-width-1-2@s">
                    <textarea
                        defaultValue={this.props.value}
                        className="uk-textarea"
                        cols="10" rows="15">
                    </textarea>
                </div>
            </form>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
