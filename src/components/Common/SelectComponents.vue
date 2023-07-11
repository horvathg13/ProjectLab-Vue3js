<script>

export default{
    props:{
       VforArray:Array,
       editname:"",

       
    },
    data(){
        return{
            selected:{
                id: "",
                name: "",
            },
            isDropdownOpen:false,
                
        }
    },
    /*computed:{
        setEditName(){
            if(this.editname !== null){
                console.log("hello from setEditName")
                return this.selected.name = this.editname
            }
        }
    },*/
    methods:{
        toggleDrop(){
            this.$emit("toggleDrop")
            this.isDropdownOpen = !this.isDropdownOpen;
            console.log("toggleDrop is working")
        },
        select(v) {
            this.selected.id = v.id;
            this.selected.name = v.name;

            this.$emit("select", {select:this.selected})
        },
        setEditName(){
            if(this.editname !== null){
                console.log("hello from setEditName")
                return this.selected.name = this.editname
            }
        }

    },
    mounted(){

        this.selected.id = null
        this.selected.name =""
        console.log(this.selected)
        setTimeout(()=>{
            this.setEditName();
           
        },15)
        
        
    }

}




</script>

<template>

    <div class="ui fluid selection dropdown" @click="toggleDrop" :class="{ active: selected.name }">
        <i class="dropdown icon"></i>
        <input type="hidden" name="user" v-model="selected.id">
            <div class="selected-text">{{ selected.name ? selected.name : "" }} </div>
            <div class="menu" :class="{ active: isDropdownOpen }" >
                <div class="item" v-for="v in VforArray" :key="v.id" @click="select(v)">
                    {{ v.name }}
                </div>
            </div>
    </div>
</template>

<style scoped>

span{
    color:rgba(0,0,0,.87);
    font-weight: unset;
}

</style>