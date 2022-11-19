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
            password2: '',
            message: ''
        }
    },
    methods: {
        register() {
            if (this.password == this.password2) {
                api.registerUser(this.username, this.password).then((result) => {
                    if (result !== 'Username already taken') {
                        this.message = '';
                        // navigate('/');
                    } else {
                        this.message = result;
                    }
                });
            } else {
                this.message = 'Passwords do not match';
            }
        }
    }
})
</script>

<template>
    <div class='register-container'>
        <h1>Register</h1>
        <div class='register-form'>
            <div class='register-form-row form-group mt-3'>
                <label htmlFor='username'>Username</label>
                <input type='text' id='username' v-model="username" class='form-control' />
            </div>
            <div class='register-form-row form-group mt-3'>
                <label htmlFor='password'>Password</label>
                <input type='password' id='password' v-model="password" class='form-control' />
            </div>
            <div class='register-form-row form-group mt-3'>
                <label htmlFor='password2'>Repeat password</label>
                <input type='password' id='password2' v-model="password2" class='form-control' />
            </div>
            <div class='register-form-row form-group mt-3'>
                <button class="btn btn-outline-success form-control" @click="register()">Register</button>
            </div>
            <div class='register-form-row form-group mt-3'>
                <label htmlFor='login'>Already have an account?</label>
                <Link class="btn btn-outline-warning form-control mt-1" id='login' to='/login'>Login</Link>
            </div>
            <div class='register-form-row'>
                <label htmlFor='message'>{{ message }}</label>
            </div>
        </div>
    </div>
</template>