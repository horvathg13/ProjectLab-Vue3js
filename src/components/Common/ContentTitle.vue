<script>
export default{
    props:{
        h1Title:"",
        message:{
            type:Number,
            default:0
        },
        route:"",
        meta:[]
    },
    data(){
        return{
        }
    },
    computed: {
        breadcrumbs() {
            return Array.isArray(this.meta) ? this.meta : [this.meta];
            
        },
        
        
    }, 
    methods:{
       
    },
    mounted() {
        
    },
 
}
</script>

<template>
    <div class="content-title-container">
        <div class="content-title" v-if="h1Title !== 'Users'">
            <h1>{{h1Title}}</h1>
        </div>
        <div class="content-title users" v-if="h1Title == 'Users'">
            <h1>{{h1Title}}</h1>
        </div>
        <div class="ui large breadcrumb" v-for="(data,index) in meta" :key="index">
            <a class="section" :href="data.path">{{data.breadcrumb}}</a>
            <i class="right chevron icon divider"></i>
        </div>
       <div class="ui large breadcrumb section" v-if="h1Title != 'Greeting' && h1Title !=='Register' && h1Title !=='Login' && h1Title !=='Homepage'" :class="{active: h1Title}"> {{ h1Title }}</div>
        <div class="message-container" v-if="h1Title != 'Greeting' && h1Title !=='Register' && h1Title !=='Login'">
            <div class="ui large red left pointing label"><a href="/messages">
                <i class="envelope icon" v-if="message !== 0 && message !== null"></i>
                <i class="envelope open icon" v-else></i>{{ message ? message: 0 }}</a></div>
        </div>
    </div>
</template>

<style scoped>
    .ui.label{
        width: max-content;
        z-index: 99;
        cursor: pointer;
        top:30px;
        
        
    }
    .message-container{
        left:calc(100% - 50%);
    }
    .content-title-container{
        width: 100%;
        z-index: 999;
        
        display: flex;
    }

    .message-container:hover {
        animation: shake 0.4s;
        animation-iteration-count: 1;
    }

@keyframes shake {
    0% { transform: translate(1px, 1px) rotate(0deg); }
    20% { transform: translate(-3px, 0px) rotate(1deg); }
    30% { transform: translate(3px, 2px) rotate(0deg); }
    60% { transform: translate(-2px, 1px) rotate(0deg); }
    70% { transform: translate(1px, 1px) rotate(-1deg); }
    100% { transform: translate(1px, -2px) rotate(-1deg); }
}

.ui.large.breadcrumb{
    max-width: max-content;
    height: 50px;
    left:calc(100% - 80%);
    top:35px;
}
.ui.breadcrumb a.section{
    color:white;
}
.ui.breadcrumb .icon.divider{
    color:black;
}
.ui.large.breadcrumb{
    color: lawngreen;
    font-weight: bold;
}

</style>