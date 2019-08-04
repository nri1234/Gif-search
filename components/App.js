var GIPHY_API_URL = "https://api.giphy.com";
var GIPHY_PUB_KEY = "usSKpVzw4FFBg7hyt1HJvEvAkXvIQBnC";
App = React.createClass({
    getInitialState() {
        return {
            loading: false,
            searchingText: "", //klucz ktory odbiera od komponentu search
            gif: {}
        };
    },
    handleSearch: function(searchingText) {
        // 1.
        this.setState({
            loading: true // 2.
        });
        this.getGif(
            searchingText,
            function(gif) {
                // 3.
                this.setState({
                    // 4
                    loading: false, // a
                    gif: gif, // b
                    searchingText: searchingText // c
                });
            }.bind(this)
        );
    },
    //Algorytm postępowania dla tej metody jest następujący:

    //Pobierz na wejściu wpisywany tekst.
    //Zasygnalizuj, że zaczął się proces ładowania.
    //Rozpocznij pobieranie gifa.
    //Na zakończenie pobierania:
    //przestań sygnalizować ładowanie,
    //ustaw nowego gifa z wyniku pobierania,
    //ustaw nowy stan dla wyszukiwanego tekstu.
    getGif: function(searchingText, callback) {
        // 1. ccallback czyli wcisniety enter
        var url =
            GIPHY_API_URL +
            "/v1/gifs/random?api_key=" +
            GIPHY_PUB_KEY +
            "&tag=" +
            searchingText; // 2.
        var xhr = new XMLHttpRequest(); // 3.
        xhr.open("GET", url);
        xhr.onload = function() {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText).data; // 4.
                var gif = {
                    // 5.
                    url: data.fixed_width_downsampled_url,
                    sourceUrl: data.url
                };
                callback(gif); // 6.
            }
        };
        xhr.send();
    },
    //Na wejście metody getGif przyjmujemy dwa parametry: wpisywany tekst (searchingText) i funkcję, która ma się wykonać po pobraniu gifa (callback).
    // Konstruujemy adres URL dla API Giphy (pełną dokumentację znajdziesz pod tym adresem).
    // Wywołujemy całą sekwencję tworzenia zapytania XHR do serwera i wysyłamy je.
    // W obiekcie odpowiedzi mamy obiekt z danymi. W tym miejscu rozpakowujemy je sobie do zmiennej data, aby nie pisać za każdym razem response.data.
    // Układamy obiekt gif na podstawie tego, co otrzymaliśmy z serwera
    // Przekazujemy obiekt do funkcji callback, którą przekazaliśmy jako drugi parametr metody getGif

    render: function() {
        var styles = {
            //style inline, brak minusa w textAlign!!
            background: "#e6f7ff",
            margin: "0 auto",
            textAlign: "center",
            width: "90%"
        };

        return (
            <div style={styles}>
                <h1>Find your favourite GIF</h1>
                <p>
                    Find your GIF on <a href="http://giphy.com">giphy</a>.
                    Press enter to add more fun.
                </p>
                <Search onSearch={this.handleSearch} />
                <Gif
                    loading={this.state.loading}
                    url={this.state.gif.url}
                    sourceUrl={this.state.gif.sourceUrl}
                />
            </div>
        );
    }
});
