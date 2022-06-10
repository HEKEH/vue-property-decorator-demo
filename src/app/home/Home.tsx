import { Vue, Component, Prop } from "vue-property-decorator";
import s from "./Home.m.sass";

@Component
export class Home extends Vue {
  $props!: Pick<Home, "title">;
  @Prop() title!: string;
  private desc: string = "描述";
  render() {
    return (
      <div class={s.Home}>
        {this.title} <span>{this.desc}</span>
        <el-input v-model={this.desc}></el-input>
      </div>
    );
  }
}
