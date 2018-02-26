<template>
  <div class="ui item">
    <i class="large user middle aligned icon"></i>
    <div class="content">
      {{appUser.username}}
      <div class="extra">
        id: {{appUser._id}}
        <a class="item"><i class="trash link icon"></i> Delete</a>
        <a class="item">Change Password</a>
      </div>
    </div>

  </div>
</template>
<script>
export default {
  props: ['appUser']
}
</script>
