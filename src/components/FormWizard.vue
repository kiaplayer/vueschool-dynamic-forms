<template>
  <div>

    <div v-if="wizardInProgress">

      <keep-alive>
        <component
          ref="currentStep"
          :is="currentStep"
          @update="processStep"
          :wizard-data="form">
        </component>
      </keep-alive>


      <div class="progress-bar">
        <div :style="`width: ${progress}%;`"></div>
      </div>

      <!-- Actions -->
      <div class="buttons">
        <button
          @click="goBack"
          v-if="currentStepNumber > 1"
          class="btn-outlined"
        >Back
        </button>
        <button
          @click="nextButtonAction"
          :disabled="!canGoNext"
          class="btn"
        >{{ isLastStep ? 'Complete Order' : 'Next'}}</button>
      </div>

    </div>

    <div v-else>
      <h1 class="title">Thank you!</h1>
      <h2 class="subtitle">
        We look forward to shipping you your first box!
      </h2>

      <p class="text-center">
        <a href="https://vueschool.io" target="_blank" class="btn">Go somewhere cool!</a>
      </p>
    </div>

  </div>
</template>

<script>
import FormPlanPicker from './FormPlanPicker'
import FormUserDetails from './FormUserDetails'
import FormAddress from './FormAddress'
import FormReviewOrder from './FormReviewOrder'
import {postFormToDB} from '../api'
export default {
  name: 'FormWizard',
  components: {
    FormPlanPicker,
    FormUserDetails,
    FormAddress,
    FormReviewOrder
  },
  data () {
    return {
      currentStepNumber: 1,
      canGoNext: false,
      steps: [
        'FormPlanPicker',
        'FormUserDetails',
        'FormAddress',
        'FormReviewOrder'
      ],
      form: {
        plan: null,
        email: null,
        name: null,
        password: null,
        address: null,
        recipient: null,
        chocolate: false,
        otherTreat: false
      }
    }
  },
  computed: {
    progress () {
      return this.currentStepNumber/this.length * 100
    },
    length() {
      return this.steps.length
    },
    currentStep() {
      return this.steps[this.currentStepNumber - 1]
    },
    isLastStep() {
      return this.currentStepNumber === this.length
    },
    wizardInProgress() {
      return this.currentStepNumber <= this.length
    }
  },
  methods: {
    submitOrder() {
      postFormToDB(this.form)
        .then(() => {
          console.log('form submitted', this.form)
          this.currentStepNumber++
        })
    },
    nextButtonAction() {
      if (this.isLastStep) {
        this.submitOrder()
      } else {
        this.goNext()
      }
    },
    processStep (step) {
      Object.assign(this.form, step.data)
      this.canGoNext = step.valid
    },
    goBack () {
      this.currentStepNumber--
      this.canGoNext = true
    },
    goNext () {
      this.currentStepNumber++
      this.$nextTick(() => {
        this.canGoNext = !this.$refs.currentStep.$v.$invalid
      })
    }
  }
}
</script>
