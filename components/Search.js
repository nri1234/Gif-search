Search = React.createClass({
    getInitialState() {
        return {
            searchingText: ''
        };
    },
    handleChange: function(event) {
        var searchingText = event.target.value;
        this.setState({searchingText: searchingText});

        if (searchingText.length > 2) { //sprawdzamy czy wpisana frazama wiecej niz 2 znaki zeby niepotrzebnie nie wysylac zapytania bez odpowiedzi
            this.props.onSearch(searchingText);
        }
    },
    handleKeyUp: function(event) {
        if (event.keyCode === 13) {
            this.props.onSearch(this.state.searchingText);
        }
    },
    render: function() {
        var styles = {
            boxShadow: "5px 4px #bfbfbf",
            padding: "5px",
            borderRadius: "3px",
            border: "1px solid black",
            fontSize: "1.5em",
            width: "90%",
            maxWidth: "350px"
        };
        return (
            <input
            type="text"
            onChange={this.handleChange}
            onKeyUp={this.handleKeyUp} //nasluchiwanie na wcisniecie enter
            placeholder="Type your gif name"
            style={styles}
            value={this.state.searchTerm}
            />
        );
    }
});
