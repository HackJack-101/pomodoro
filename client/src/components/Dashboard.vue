<template>
    <div id="dahsboard">
        <h1 class="title">🍅 Pomodoro Dashboard 🍅</h1>
        <div class="users">
            <div v-for="user in users" v-bind:class="'user ' + getClassState(user.state)">
                <div class="user-container">
                    <div class="name">{{user.name}}</div>
                    <div class="avatar-container center">
                        <img width=64 class="avatar" height=64 v-bind:src="'data:image/png;base64,'+ user.picture">
                    </div>
                </div>
                <div v-if="user.state === 0">
                    <div class="state">Not working</div>
                    <div class="actions">
                        <button role="button" v-on:click.prevent="startPomodoro(user.id)" class="start">Start Pomodoro</button>
                    </div>
                </div>
                <div v-else-if="user.state === 1">
                    <div class="state">Working</div>
                    <div class="remainDuration">{{displayTime(user.pomodoroStart + user.pomodoroDuration - now, user.id, 1)}}</div>
                    <div class="actions">
                        <button role="button" v-on:click.prevent="stopPomodoro(user.id)" class="stop">Stop working</button>
                        <div class="take-break">Take a break</div>
                        <div class="breaks">
                            <button role="button" v-on:click.prevent="shortBreak(user.id)" class="pause">Short</button>
                            <button role="button" v-on:click.prevent="longBreak(user.id)" class="pause">Long</button>
                            <button role="button" v-on:click.prevent="customLongBreak(user.id)" class="pause">Custom</button>
                        </div>
                    </div>
                </div>
                <div v-else-if="user.state === 2">
                    <div class="state">Short break</div>
                    <div class="remainDuration">{{displayTime(user.pomodoroStart + user.pomodoroDuration - now, user.id, 2)}}</div>
                    <div class="actions">
                        <button role="button" v-on:click.prevent="startPomodoro(user.id)" class="stop">Stop break</button>
                    </div>
                </div>
                <div v-else-if="user.state === 3">
                    <div class="state">Long break</div>
                    <div class="remainDuration">{{displayTime(user.pomodoroStart + user.pomodoroDuration - now, user.id, 3)}}</div>
                    <div class="actions">
                        <button role="button" v-on:click.prevent="startPomodoro(user.id)" class="stop">Stop break</button>
                    </div>
                </div>
                <div v-else>
                    <div>Unknown state : {{user.state}}</div>
                </div>

                <button v-bind:class="'delete ' + getClassState(user.state)" role="button" v-on:click.prevent="deleteUser(user.id, user.name)">X</button>
            </div>
        </div>
        <hr/>
        <div class="center medium-size">Add user</div>
        <div class="center">
            <form v-on:submit.prevent="addUser" id="addUser">
                <div class="fields">
                    <label for="login">Name :</label>
                    <input type="text" id="name" v-model="newUser.name"/>
                </div>
            </form>
        </div>
    </div>
</template>
<style>
    .actions {
        margin-top: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        flex-wrap: wrap;
    }

    .take-break {
        margin: 5px 0 2px 0;
        text-align: center;
        font-size: 1.1em;
        font-weight: bold;
    }

    .breaks {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .actions button {
        margin-bottom: 5px;
        border: none;
        cursor: pointer;
        padding: 2px 5px;
        color: #fff;
        font-weight: bold;
        border-radius: 4px;
    }

    .medium-size {
        font-size: 2em;
        font-weight: bold;
    }

    #addUser {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        font-size: 1.5em;
    }

    input[type="text"] {
        color: #fff;
        background: transparent;
        border: none;
        border-bottom: 1px solid #fff;
        padding: 0 0 2px 5px;
        font-size: 1em;
    }

    .delete {
        position: absolute;
        top: -10px;
        right: -10px;
        z-index: 2;
        border-radius: 12px;
        display: block;
        width: 22px;
        text-align: center;
        height: 21px;
        margin: auto;
        font-weight: bold;
        cursor: pointer;
        background: #bdbdbd;
        color: #fff;
        border: solid 1px #454545;
    }

    .user-container {
        position: relative;
    }

    .name {
        font-weight: bold;
        text-align: center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 2.5em;
        color: #03A9F4;
        z-index: 2;
    }

    .state {
        font-style: italic;
        text-align: center;
    }

    .avatar {
        background: #f0f0f0;
        border: solid #f0f0f0 10px;
        border-radius: 64px;
    }

    .avatar-container {
        opacity: 0.5;
    }

    .center {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    .title {
        text-align: center;
    }

    .users {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-around;
    }

    .user {
        position: relative;
        background: #fff;
        border-radius: 2px;
        color: #000;
        width: 200px;
        height: 250px;
        padding: 5px;
        margin-bottom: 20px;
        border: 4px solid #1c6399;
    }

    .working {
        border-color: #e53935;
    }

    .break {
        border-color: #8bc34a;
    }

    .not-working {
        border-color: #2196f3;
    }

    .start {
        background: #8bc34a;
    }

    .stop {
        background: #e53935;
    }

    .pause {
        background: #ff9800;
    }

    .remainDuration {
        font-size: 3em;
        text-align: center;
        font-weight: bold;
    }
</style>

<script>
    let prefixURL;
    /** Development configuration **/
    prefixURL = '//localhost:3000/';
    /** Production configuration **/
    //prefixURL = '/';
    export default{
        data(){
            return {
                users: [],
                newUser: {
                    name: ''
                },
                count: {
                    now: Date.now()
                }
            }

        },
        mounted()
        {
            this.$http.get(prefixURL + 'api/users').then((response) => {
                response.json().then((message) => {
                    this.users = message;
                }, () => {
                    console.error('Error GET /api/users')
                });
            });

            let self = this;
            let updateNow = function() {
                self.count.now = Date.now();
            };
            updateNow();
            window.setInterval(updateNow, 1000)
        },
        computed: {
            now: function() {
                return this.count.now;
            }
        },
        methods: {
            getClassState: function(state) {
                switch (state) {
                    case 1:
                        return 'working';
                    case 2:
                    case 3:
                        return 'break';
                    default:
                        return 'not-working';
                }
            },
            displayTime: function(ms, id, state) {
                if (ms < 0) {
                    switch (state) {
                        case 1:
                            this.stopPomodoro(id);
                            break;
                        case 2:
                        case 3:
                        default:
                            this.startPomodoro(id);
                    }
                    return '';
                } else {
                    let s = Math.trunc(ms / 1000);
                    let m = Math.trunc(s / 60);
                    let remainSec = s - (m * 60);
                    return (m < 10 ? '0' : '') + m + ':' + (remainSec < 10 ? '0' : '') + remainSec;
                }
            },
            addUser: function() {
                this.$http.post(prefixURL + 'api/user', JSON.stringify(this.newUser)).then((response) => {
                    response.json().then((message) => {
                        this.users = message;
                    });
                    this.newUser.name = '';
                }, (error) => {
                    console.warn('Error POST /api/user');
                });
            },
            startPomodoro: function(id) {
                this.$http.post(prefixURL + 'api/start', JSON.stringify({id: id, duration: (25 * 60 * 1000)})).then((response) => {
                    response.json().then((message) => {
                        this.users = message;
                    });
                }, (error) => {
                    console.warn('Error POST /api/start');
                });
            },
            shortBreak: function(id) {
                this.$http.post(prefixURL + 'api/break', JSON.stringify({id: id, duration: (5 * 60 * 1000), state: 2})).then((response) => {
                    response.json().then((message) => {
                        this.users = message;
                    });
                }, (error) => {
                    console.warn('Error POST /api/break');
                });
            },
            longBreak: function(id) {
                this.$http.post(prefixURL + 'api/break', JSON.stringify({id: id, duration: (15 * 60 * 1000), state: 3})).then((response) => {
                    response.json().then((message) => {
                        this.users = message;
                    });
                }, (error) => {
                    console.warn('Error POST /api/break');
                });
            },
            customLongBreak: function(id) {
                let customDuration = parseInt(window.prompt('Enter your custom long break : (in min', '15'));
                this.$http.post(prefixURL + 'api/break', JSON.stringify({id: id, duration: (customDuration * 60 * 1000), state: 3})).then((response) => {
                    response.json().then((message) => {
                        this.users = message;
                    });
                }, (error) => {
                    console.warn('Error POST /api/break');
                });
            },
            stopPomodoro: function(id) {
                this.$http.post(prefixURL + 'api/stop', JSON.stringify({id: id})).then((response) => {
                    response.json().then((message) => {
                        this.users = message;
                    });
                }, (error) => {
                    console.warn('Error POST /api/start');
                });
            },
            deleteUser: function(id, name) {
                if (window.confirm("This action will delete the user " + name + ". Are you sure?")) {
                    this.$http.post(prefixURL + 'api/delete', JSON.stringify({id: id})).then((response) => {
                        response.json().then((message) => {
                            this.users = message;
                        });
                    }, (error) => {
                        console.warn('Error POST /api/delete');
                    });
                }
            }
        }
    }
</script>
