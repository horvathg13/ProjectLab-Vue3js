<script>
export default{
    data(){

    },
    methods:{
        register(){
            this.$router.push("/register");
        },

        login(){
            this.$router.push("/login");
        }
    }
}
</script>

<template>
    <div class="g-main-container">
        <div class="background greeting">
        </div>

        <div class="g-header-container">
            <div class="g-main-header">
                <h1><span>Pro</span>ject-Lab</h1>
            </div>
            <div class="g-header">
                <h2>Build your own project</h2>
                <h2>and manage your tasks easy</h2>
            </div>
            <div class="g-buttons">
                <button class="massive ui orange button" @click="register">Register</button>
                <button class="massive ui green button" @click="login">Login</button>
            </div>

        </div>


    </div>
</template>

<style scoped>

</style>