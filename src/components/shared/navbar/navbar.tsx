import { component$, useStyles$ } from "@builder.io/qwik";
import { QwikLogo } from "~/components/shared/icons/qwik";
import { Link } from "@builder.io/qwik-city";

import styles from "./navbar.css?inline";

export default component$(() => {
  useStyles$(styles);
  return (
    <header class="header">
      <div class="container wrapper">
        <div class="logo">
          <Link href="/" title="qwik">
            <QwikLogo height={50} />
          </Link>
        </div>
        <ul>
          <li>
            <Link href="/login/">Login</Link>
          </li>
          <li>
            <Link href="/dashboard/">Admin Dashboard</Link>
          </li>
          <li>
            <Link href="/counter/">CounterHook</Link>
          </li>
          <li>
            <Link href="/pokemons/list-ssr/">SSR-List</Link>
          </li>
          <li>
            <Link href="/pokemons/list-client/">Client-List</Link>
          </li>
        </ul>
      </div>
    </header>
  );
});