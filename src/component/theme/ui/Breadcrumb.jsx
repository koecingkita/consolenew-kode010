import { useLocation } from '@solidjs/router'
import { AiOutlineRight } from 'solid-icons/ai'
import { RiSystemDashboardHorizontalFill } from 'solid-icons/ri'
import { BiSolidDashboard } from 'solid-icons/bi'
import { A } from '@solidjs/router';

function Breadcrumbs() {
  const location = useLocation();

  const path = () => {
    const segment = location.pathname.split("/").filter(Boolean);
    return segment ? segment : false;
  };

  const parentHref = () => path()[0] ? `/${path()[0]}` : '/';

  return (<>
    <nav class="flex" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        <li class="inline-flex items-center">
          <A href="/" class="inline-flex items-center text-sm text-body gap-2 hover:text-fg-brand">
            <BiSolidDashboard />
            Dashboard
          </A>
        </li>
        {path() &&
          path().map((seg, i) => (
            <li aria-current="page" class="flex items-center gap-1 text-sm">
              <AiOutlineRight />

              {i === 0 ? (
                // Parent clickable
                <A href={parentHref()} class="capitalize">
                  {seg.replace(/-/g, ' ')}
                </A>
              ) : (
                // Child/action = text biasa
                <span class="capitalize">{seg.replace(/-/g, ' ')}</span>
              )}
            </li>
          ))
        }

      </ol>
    </nav>

  </>);
}

export default Breadcrumbs;

/*
mau bikin kondisi
jika '/' maka dashboard > aja

jika '/artikel' maka /artikel

projectnya gaada
*/
