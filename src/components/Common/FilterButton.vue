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
            selected:[],
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
            const selectedFilter = {
                id: v.id,
                name: v.name
            };
            let exist = this.selected.some(d => d.id === selectedFilter.id)
            if(!exist){
                this.selected.push(selectedFilter);
                this.$emit("select", {select:this.selected})
            }
            
        },
        deleteSelected(){
            this.selected = []
            this.$emit("deleteSelected")
        }
    }
}
</script>

<template>
   <div class="ui floating small icon dropdown button" :class="{labeled:Object.keys(selected).length>0, loading:loader, disabled:disable}" @click="toggleDropdown" >
        <i class="filter icon"></i>
        <label><div class="selected-text" v-for="select in selected" :key="select.id">{{ select.name ? select.name:""  }} </div></label>

        <div class=" menu" :class="{active:isDropdownOpen && disable===false}"  >
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