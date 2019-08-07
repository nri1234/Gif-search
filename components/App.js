const GIPHY_API_URL = "https://api.gipy.com";
const GIPHY_PUB_KEY = "usSKpVzw4FFBg7hyt1HJvEvAkXvIQBnC";
App = React.createClass({
    getInitialState: function getInitialState() {
        return {
            loading: false,
            searchingText: "",
            gif: {}
        };
    },

    handleSearch: function(searchingText) {
        this.setState({
            loading: true
        });
        this.getGif(searchingText)
            .then(gif =>
                this.setState({
                    loading: false,
                    gif: gif,
                    searchingText: searchingText
                })
            )
            .catch(error =>
                console.error("Oh no, something is wrong!!!", error)
            ),
            this.setState({
                //brak ladowania
                loading: false
            });
    },
    getGif: searchingText => {
        const url = `${GIPHY_API_URL}/v1/gifs/random?api_key=${GIPHY_PUB_KEY}&tag=${searchingText}`;
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.onload = function() {
                if (this.status === 200) {
                    let data = JSON.parse(this.responseText).data;
                    let gif = {
                        url: data.fixed_width_downsampled_url,
                        sourceUrl: data.url
                    };
                    resolve(gif);
                } else {
                    reject(new Error(this.statusText));
                }
            };
            request.onerror = function() {
                reject(new Error(`XMLHttpRequest Error: ${this.statusText}`));
            };
            request.open("GET", url);
            request.send();
        });
    },
    render: function() {
        let styles = {
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
