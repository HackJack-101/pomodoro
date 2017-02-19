<template>
    <div id="dahsboard">
        <h1>Pomodoro Dashboard</h1>
        <div class="users">
            <div v-for="user in users" class="user">
                <div class="center">{{user.name}}</div>
                <div class="state">{{user.state}}</div>
                <div class="pomodoroStart">{{user.pomodoroStart}}</div>
                <div class="pomodoroDuration">{{user.pomodoroDuration}}</div>
                <div v-if="user.state === 0">
                    <button role="button" v-on:click.prevent="startPomodoro(user.id)">Start Pomodoro</button>
                </div>
                <div v-else>
                    <button role="button" v-on:click.prevent="stopPomodoro(user.id)">Stop</button>
                    <button role="button" v-on:click.prevent="shortBreak(user.id)">Short Break</button>
                    <button role="button" v-on:click.prevent="longBreak(user.id)">Long Break</button>
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
                }
            }
        },
        mounted(){
            this.$http.get('//localhost:3000/api/users').then((response) => {
                response.json().then((message) => {
                    this.users = message;
                }, () => {
                    console.error('Error GET /api/users')
                });
            });
        },
        methods: {
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
            }
        }
    }
</script>
