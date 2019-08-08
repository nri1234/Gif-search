var GIPHY_API_URL = "https://api.gipy.com";
var GIPHY_PUB_KEY = "usSKpVzw4FFBg7hyt1HJvEvAkXvIQBnC";
App = React.createClass({
    getInitialState: function getInitialState() {
        return {
            loading: false,
            searchingText: "", //klucz ktory odbiera od komponentu search
            gif: {}
        };
    },

    handleSearch: function handleSearch(searchingText) {


        this.setState({
            loading: true
        });
        this.getGif(searchingText)
            .then(function(gif) {
                return this.setState({
                    //jesli tekst zostanie wpisany rozpocznij pobieranie gifa
                    loading: false,
                    gif: gif,
                    searchingText: searchingText
                });
        }.bind(this))
            .catch(function(error) {
                return (
                    console.error("Oh no, something is wrong!!!", error), // wylap i pokaz blad
                    this.setState({
                        //brak ladowania
                        loading: false
                    })
                );
        }.bind(this));
    },
    //Algorytm postępowania dla tej metody jest następujący:

    //Pobierz na wejściu wpisywany tekst.
    //Zasygnalizuj, że zaczął się proces ładowania.
    //Rozpocznij pobieranie gifa.
    //Na zakończenie pobierania:
    //przestań sygnalizować ładowanie,
    //ustaw nowego gifa z wyniku pobierania,
    //ustaw nowy stan dla wyszukiwanego tekstu.
    // 1. ccallback czyli wcisniety enter
    getGif: function getGif(searchingText) {
        var url =
            GIPHY_API_URL +
            "/v1/gifs/random?api_key=" +
            GIPHY_PUB_KEY +
            "&tag=" +
            searchingText;
        return new Promise(function(resolve, reject) {
            //nowa obietnica
            var request = new XMLHttpRequest(); //
            //Wywołujemy całą sekwencję tworzenia zapytania request do serwera i wysyłamy je.
            request.onload = function() {
                if (this.status === 200) {
                    var data = JSON.parse(this.responseText).data;
                    var gif = {
                        url: data.fixed_width_downsampled_url,
                        sourceUrl: data.url
                    }; // W obiekcie odpowiedzi mamy obiekt z danymi. W tym miejscu rozpakowujemy je sobie do zmiennej data, aby nie pisać za każdym razem response.data.
                    resolve(gif); //jesli wszystko ok to pokaz gif
                } else {
                    //jesli nie to pokazujemy bład
                    reject(new Error(this.statusText));
                }
            };
            request.onerror = function() {
                reject(new Error("XMLHttpRequest Error: " + this.statusText));
            }; //przekazujemy polecenie pokazania bledu
            request.open("GET", url);
            request.send();
        });
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
                    Find your GIF on <a href="http://giphy.com">giphy</a>. Press
                    enter to add more fun.
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
