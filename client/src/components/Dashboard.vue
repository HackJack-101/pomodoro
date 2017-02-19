<template>
    <div id="dahsboard">
        <h1>Pomodoro Dashboard</h1>
        <div class="users">
            <div v-for="user in users" class="user">
                <div class="center">{{user.name}}</div>
                <div v-if="user.state === 0">
                    <div>Not working</div>
                    <button role="button" v-on:click.prevent="startPomodoro(user.id)">Start Pomodoro</button>
                </div>
                <div v-if="user.state === 1">
                    <div>Working</div>
                    <div class="remainDuration">{{displayTime(user.pomodoroStart + user.pomodoroDuration - now, user.id, 1)}}</div>
                    <button role="button" v-on:click.prevent="stopPomodoro(user.id)">Stop working</button>
                    <button role="button" v-on:click.prevent="shortBreak(user.id)">Short break</button>
                    <button role="button" v-on:click.prevent="longBreak(user.id)">Long break</button>
                    <button role="button" v-on:click.prevent="customLongBreak(user.id)">Custom long break</button>
                </div>
                <div v-if="user.state === 2">
                    <div>Short break</div>
                    <div class="remainDuration">{{displayTime(user.pomodoroStart + user.pomodoroDuration - now, user.id, 2)}}</div>
                    <button role="button" v-on:click.prevent="startPomodoro(user.id)">Stop break</button>
                </div>
                <div v-if="user.state === 3">
                    <div>Long break</div>
                    <div class="remainDuration">{{displayTime(user.pomodoroStart + user.pomodoroDuration - now, user.id, 3)}}</div>
                    <button role="button" v-on:click.prevent="startPomodoro(user.id)">Stop break</button>
                </div>
                <div v-else>
                </div>
            </div>
        </div>
        <div>
            <form v-on:submit.prevent="addUser">
                <div>
                    <label for="login">Name :</label>
                    <input type="text" id="name" v-model="newUser.name"/>
                </div>

                <div class="actions">
                    <input type="submit" class="special" value="Add user"/>
                </div>
            </form>
        </div>
    </div>
</template>
<style>
    .users {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-around;
    }

    .user {
        background: #fff;
        border: solid black 1px;
        color: #000;
        width: 200px;
        height: 200px;
    }
</style>

<script>
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
            this.$http.get('//localhost:3000/api/users').then((response) => {
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
                this.$http.post('//localhost:3000/api/user', JSON.stringify(this.newUser)).then((response) => {
                    response.json().then((message) => {
                        this.users = message;
                    });
                }, (error) => {
                    console.warn('Error POST /api/user');
                });
            },
            startPomodoro: function(id) {
                this.$http.post('//localhost:3000/api/start', JSON.stringify({id: id, duration: (25 * 60 * 1000)})).then((response) => {
                    response.json().then((message) => {
                        this.users = message;
                    });
                }, (error) => {
                    console.warn('Error POST /api/start');
                });
            },
            shortBreak: function(id) {
                this.$http.post('//localhost:3000/api/break', JSON.stringify({id: id, duration: (5 * 60 * 1000), state: 2})).then((response) => {
                    response.json().then((message) => {
                        this.users = message;
                    });
                }, (error) => {
                    console.warn('Error POST /api/break');
                });
            },
            longBreak: function(id) {
                this.$http.post('//localhost:3000/api/break', JSON.stringify({id: id, duration: (15 * 60 * 1000), state: 3})).then((response) => {
                    response.json().then((message) => {
                        this.users = message;
                    });
                }, (error) => {
                    console.warn('Error POST /api/break');
                });
            },
            customLongBreak: function(id) {
                let customDuration = parseInt(window.prompt('Enter your custom long break : (in min', '15'));
                this.$http.post('//localhost:3000/api/break', JSON.stringify({id: id, duration: (customDuration * 60 * 1000), state: 3})).then((response) => {
                    response.json().then((message) => {
                        this.users = message;
                    });
                }, (error) => {
                    console.warn('Error POST /api/break');
                });
            },
            stopPomodoro: function(id) {
                this.$http.post('//localhost:3000/api/stop', JSON.stringify({id: id})).then((response) => {
                    response.json().then((message) => {
                        this.users = message;
                    });
                }, (error) => {
                    console.warn('Error POST /api/start');
                });
            }
        }
    }
</script>
