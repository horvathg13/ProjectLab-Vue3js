<script>
export default{
    props:{
        h1Title:"",
    },
    data(){
        return{

        }
    },
    methods:{
        
    },
}
</script>

<template>
    <div class="content-title" v-if="h1Title !== 'Users'">
        <h1>{{h1Title}}</h1>
    </div>
    <div class="content-title users" v-if="h1Title == 'Users'">
        <h1>{{h1Title}}</h1>
    </div>
</template>

<style>
</style>