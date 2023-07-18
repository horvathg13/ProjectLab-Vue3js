<script>
import VueClickAway from 'vue3-click-away';

export default{
    props:{
        data:Array
    },
    directives:{
        
    },
    data(){
        return{
            isDropdownOpen:false,
            SelectCompData:[],
            selected:{},
            loader:false
        }
    },
    watch:{
        'data':{
            immediate:true,
            deep:true,
            handler(newValue){
                this.SelectCompData = newValue
                this.loader = false
                console.log("hello from filter button",this.SelectCompData)
            }
        },
    },
    methods:{
        toggleDropdown(){
            if(this.SelectCompData.length == 0){
                this.loader = true
            }
            this.isDropdownOpen = !this.isDropdownOpen
            if(this.isDropdownOpen == false){
                this.SelectCompData = []
            }
        },
        select(v) {
            this.selected.id = v.id;
            this.selected.name = v.name;
            this.$emit("select", {select:this.selected})
        },
        deleteSelected(){
            this.selected = {}
            this.$emit("deleteSelected")
        }
    }
}
</script>

<template>
   
    <div class="ui floating small icon dropdown button" :class="{labeled:Object.keys(selected).length>0, loading:loader}" @click="toggleDropdown" >
        <i class="filter icon"></i>
        <label><div class="selected-text">{{ selected.name ? selected.name:""  }} </div></label>
        <!--<span class="text">Filter</span>-->
        <div class=" menu" :class="{active:isDropdownOpen}"  >
            <div class="header item" @click="deleteSelected" v-if="this.SelectCompData.length>0">
                Clear <i class="trash icon"></i>
            </div>
            <div class="divider"></div>
            <div class="item" v-for="v in SelectCompData" :key="v.id" @click="select(v)">
            {{ v.name }}</div>
        </div>
        
    </div>
        
   
</template>

<style scoped>
    .header{
        min-height: 0;
        margin:5px auto !important
    }
    .header:hover{
        background-color: rgba(255, 110, 58, 0.242) !important;
    }
    .ui.dropdown{
        margin: 0 3px;
        padding:8px;
    }
    .filterMainContainer{
        display: flex;
    }
</style>