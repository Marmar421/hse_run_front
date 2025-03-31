<template>
  <svg 
    class="circle-point"
    viewBox="0 0 66 66" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- Красный круг -->
    <circle 
      cx="33" 
      cy="33" 
      r="33" 
      fill="#C80002"
    />
    
    <!-- Белый круг -->
    <circle 
      cx="33" 
      cy="33" 
      r="18" 
      fill="#F3F3F3"
    />
  </svg>
</template>

<script>
export default {
  name: 'CirclePoint'
}
</script>

<style scoped>
.circle-point {
  width: 66px;
  height: 66px;
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  .circle-point {
    width: 40px; /* меньший размер для мобильных */
    height: 40px;
  }
}
</style> 