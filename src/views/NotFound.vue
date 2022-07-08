<template>
  <div>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-6">
          <div class="text-center mt-4">
            <img
              class="mb-4 img-error"
              src="@/assets/imgs/error-404-monochrome.svg"
            />
            <p class="lead">
              La URL solicitada no se encuentra en el servidor.
            </p>
            <router-link to="/categories">
              <i class="fas fa-arrow-left me-1"></i>
              Regresar al inicio
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  Components: {

  },
};
</script>