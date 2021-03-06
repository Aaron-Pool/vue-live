/* eslint-disable no-eval */
import compileCode from "../compileCode";

describe("compileCode", () => {
  // eslint-disable-next-line no-unused-vars
  let dummySet;
  // eslint-disable-next-line no-unused-vars
  function Vue(param) {
    dummySet = param;
  }
  it("bake template into a new Vue", () => {
    const sut = compileCode(`
<template>
	<div/>
</template>
<script>
const param = 'Foo'
export default {
	param
}
</script>`);
    eval(sut.script);
    expect(dummySet).toMatchObject({ param: "Foo" });
  });

  it("shoud be fine with using the `new Vue` structure", () => {
    const sut = compileCode(`
let param = 'Bar';
new Vue({
	param
});`);
    eval(sut.script);
    expect(dummySet).toMatchObject({ param: "Bar" });
  });

  it("shoud work with the vsg way", () => {
    const sut = compileCode(`
		let param = 'BazBaz';
		<div>
			<button> {{param}} </button>
		</div>
		`);
    expect(sut.script.trim()).toBe("var param = 'BazBaz';");
  });
});
