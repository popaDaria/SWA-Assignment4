<script lang="ts">
import * as api from '@/api/api'
import { model } from '@/api/store'
import { defineComponent } from "vue";

export default defineComponent({
    data() {
        return {
            model,
            username: '',
            password: '',
            message: ''
        }
    },
    methods: {
        logIn() {
            api.loginUser(this.username, this.password).then((result) => {
                if (result !== 'Invalid username or password') {
                    model.login(result);
                    this.message = '';
                    //navigate('/');
                } else {
                    this.message = result;
                }
            });
        }
    }
})
</script>

<template>
    <div class='login-container'>
        <h1>Login</h1>
        <div class='login-form'>
            <div class='login-form-row form-group mt-3'>
                <label htmlFor='username'>Username</label>
                <input type='text' id='username' v-model="username" class='form-control' />
            </div>
            <div class='login-form-row form-group mt-1'>
                <label htmlFor='password'>Password</label>
                <input type='password' id='password' v-model="password" class='form-control' />
            </div>
            <div class='login-form-row form-group'>
                <button class="btn btn-outline-success form-control mt-3" @click="logIn()">Login</button>
            </div>
            <div class='login-form-row form-group mt-3'>
                <label htmlFor='register'>Don't have an account?</label>
                <Link id='register' to='/register' class="btn btn-outline-warning form-control mt-1">Register</Link>
            </div>
            <div class='login-form-row'>
                <label>{{ message }}</label>
            </div>
        </div>
    </div>
</template>