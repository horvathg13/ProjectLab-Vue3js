<script>
    export default{
        props:{
            data:Array,
            component:"",
            role:Array,
        },
        data(){
            return{
                circulardrop:false
            }
        },
        methods:{
            circularMenuDropdown(){
                this.circulardrop = !this.circulardrop
                console.log("circular drop")
            },
            redirectEmit(){
                this.$emit("redirect", {data: this.data})
            },
            showParticipantModalEmit(){
                this.$emit("showParticipantModal", {data: this.data})
            },
        }
    }
</script>

<template>
    <button class="circular ui scrolling dropdown blue icon button" @click="circularMenuDropdown">
        <i class="ellipsis horizontal icon"></i>
        <div class="right menu"  :class="{ active: this.circulardrop }">
            <div class="item" v-if="component === 'Projects'"><button class="ui small orange button" @click="redirectEmit()"><i class="tasks icon"></i>View Tasks</button></div>
            <div class="item"><button class="ui small green button" @click="showParticipantModalEmit()"><i class="user plus icon"></i>Employees</button></div>

        </div>
    </button>
</template>


<style scoped>
    .ui.button.dropdown .menu.active{
        display: block !important;

    }
</style>