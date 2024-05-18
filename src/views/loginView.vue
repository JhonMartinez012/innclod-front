<template>
    <v-container class="">
        <v-content>
            <v-container fluid fill-height>
                <v-layout align-center justify-center>
                    <v-flex xs12 sm8 md4>
                        <v-card class="elevation-12">
                            <v-toolbar dark color="primary">
                                <v-toolbar-title>LOGIN</v-toolbar-title>
                            </v-toolbar>
                            <v-card-text>
                                <v-form>
                                    <v-text-field v-model="email" prepend-icon="mdi-account" name="login" label="Login"
                                        type="text"></v-text-field>
                                    <v-text-field v-model="password" id="password" prepend-icon="mdi-lock"
                                        name="password" label="Password" type="password"></v-text-field>
                                </v-form>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" @click="login">Login</v-btn>
                            </v-card-actions>
                        </v-card>
                        <v-alert v-if="bError" dense outlined type="error">
                            ERROR AL INGRESAR, REVISE USUARIO O CONTRASEÑA!
                        </v-alert>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-content>
    </v-container>
</template>

<script>
import auth from "@/auth/auth.js"
export default {
    data: () => ({
        email: '',
        password: '',
        bError: false,

    }),

    methods: {
        async login() {
            try {
                const oRespuesta = await auth.login(this.email, this.password)
                if (oRespuesta !== undefined) {
                    if (oRespuesta.status == 200) {
                        localStorage.setItem('access_token', oRespuesta.data.access_token)                        
                        this.$router.push('/lista-documentos')
                        // seteamos setLoggin
                        this.$store.commit('setLoggin', true)
                    }
                }
            } catch (error) {
                this.bError = true
                console.log("error",error);
            }
        }
    }
}
</script>