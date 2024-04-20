<script>
export default{
    props:{
        
    },
    watch:{
        
    },
    data(){

    },
    methods:{

    },
}

</script>

<template>
    <div class="ui segment" >
        <div class="ui active dimmer">
            <div class="ui small text loader">Loading</div>
        </div>
        <p></p>
    </div>
</template>

<style scoped>
    .ui.segment{
        position: absolute !important;
        width:100%;
        height: 100% !important;
        
    }
    .ui.dimmer{
        background-color: rgba(0, 0, 0, 0.75);
    }
</style>