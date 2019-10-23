import React, { Component } from 'react';

import './styles.css';

var SpotifyWebApi = require('spotify-web-api-node');

var spotifyApi = new SpotifyWebApi({
    clientId: 'ec764db0ded7495dadb967725e9ced59',
    clientSecret: '5830e377db754d328989ab9cb47f8562',
    redirectUri: 'http://www.example.com/callback'
});

class FirstPage extends Component {
    constructor(props) {
        super(props);

        const params = this.getHashParams();

        this.state = {
            access_token: params.access_token,
            user_image: '',
            user_name: '',
            total_pages: '',
            user_musics: '',
            page: 0
        };

        spotifyApi.setAccessToken(this.state.access_token);

        this.getMe = this.getMe.bind(this);
        this.getMe();

        this.getSavedTracks = this.getSavedTracks.bind(this);
        this.getSavedTracks(this.state.page);

        this.nextPage = this.nextPage.bind(this);
        this.previousPage = this.previousPage.bind(this);
        // this.removeTrack = this.removeTrack.bind(this);
    }

    getHashParams() {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        while (e = r.exec(q)) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
        }
        return hashParams;
    }

    async getMe() {
        await spotifyApi.getMe()
            .then((data) => {
                // console.log('Some information about the authenticated user', data.body);
                this.setState({ user_image: data.body.images[0].url, user_name: data.body.display_name });

            }, (err) => {
                console.log('Erro getMe!', err);
            });
    };

    async getSavedTracks(pag) {
        await spotifyApi.getMySavedTracks({
            limit: 10,
            offset: pag
        })
            .then((data) => {
                console.log('Done!');
                console.log(data);
                this.setState({ total_pages: data.body.total, user_musics: data.body.items });
            }, (err) => {
                console.log('Something went wrong!', err);
            });
    }

    async removeTrack(music_id) {
        await spotifyApi.removeFromMySavedTracks([music_id])
             .then( (data) => {
                 console.log('Removed!');
                 console.log(music_id);
                 this.getSavedTracks(this.state.page);
             }, (err) => {
                 console.log('Something went wrong!', err);
             });
        
        
     };

    nextPage() {
        console.log('proximo');
        if (this.state.page === this.state.total_pages) {
            console.log(this.state.page);
            return
        }
        else {
            console.log(this.state.page);

            const pageNumber = this.state.page + 20;

            this.setState({ page: pageNumber })

            console.log(this.state.page);

            this.getSavedTracks(pageNumber);
        }

    };

    previousPage() {
        console.log('anterior');
        if (this.state.page === 0) {
            console.log(this.state.page);
            return
        }
        else {

            console.log(this.state.page);

            const pageNumber = this.state.page - 20;

            this.setState({ page: pageNumber })

            console.log(this.state.page);

            this.getSavedTracks(pageNumber);
        }
    }

    render() {
        return (
            <div className="FirstPage">
                <div className='usuario'>
                    <img src={this.state.user_image} ></img>
                    <p><strong>Bem vindo {this.state.user_name}!</strong></p>
                    <p></p>
                    <p><strong>Suas músicas salvas:</strong></p>
                </div>

                <div className='music-list'>
                    {Object.entries(this.state.user_musics).map(([k, v]) => (
                        <article key={v.track.id}>
                            <p>
                                <img src={v.track.album.images[1].url} ></img>
                                <button id={v.track.id} onClick={this.removeTrack.bind(this,v.track.id)}>Remover Música</button>
                            </p>
                            <a><strong>{v.track.name}</strong></a>
                        </article>
                    ))}
                </div>

                <div className='actions'>
                    <button className='left-button' disabled={this.state.page === 0} onClick={this.previousPage}>Anterior</button>
                    <button disabled={this.state.page === this.state.total_pages} onClick={this.nextPage}>Próximo</button>
                </div>

            </div>
        )
    }

};

export default FirstPage;