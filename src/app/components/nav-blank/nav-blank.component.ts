import { Component, computed, ElementRef, inject, OnInit, Renderer2, Signal, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { FlowbiteService } from '../../core/services/flowbite/flowbite.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { OwnTranslateService } from '../../core/services/ownTranslate/own-translate.service';
import { CartService } from '../../core/services/cart/cart.service';
import { WishlistService } from '../../core/servcices/wishlist/wishlist.service';

@Component({
  selector: 'app-nav-blank',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslateModule],
  templateUrl: './nav-blank.component.html',
  styleUrl: './nav-blank.component.scss'
})
export class NavBlankComponent implements OnInit {

  readonly _AuthService = inject(AuthService);
  private readonly _OwnTranslateService = inject(OwnTranslateService)
  readonly _TranslateService = inject(TranslateService)
  private readonly _CartService = inject(CartService)
  private readonly _WishlistService = inject(WishlistService)
  @ViewChild('navbarDefault', { static: false }) navbarDefault!: ElementRef;
  isNavbarOpen = false;



  cartCount: Signal<number> = computed(() => this._CartService.cartQuantity());
  WishlistCount: Signal<number> = computed(() => this._WishlistService.wishListQuantity());

  constructor(private _FlowbitService: FlowbiteService,
    private renderer: Renderer2
  ) {

  }

  ngOnInit(): void {
    // cart quantity at the start
    this.getCartAtStart();
    this.getWislistAtStart()

    this._FlowbitService.loadFlowbite(() => {

    });

  }
  change(lang: string): void {
    this._OwnTranslateService.changeLang(lang);
  }
  getCartAtStart(): void {
    this._CartService.getCartProducts().subscribe({
      next: (res) => {
        this._CartService.cartQuantity.set(res.numOfCartItems);
      }
    });
  }

  getWislistAtStart(): void {
    this._WishlistService.getWishlist().subscribe({
      next: (res) => {
        // this.WishlistCount = res.count
        this._WishlistService.wishListQuantity.set(res.count);

      }
    });
  }


  toggleNavbar() {
    this.isNavbarOpen = !this.isNavbarOpen;

    if (this.isNavbarOpen) {
      // Use Renderer2 to add any necessary classes or manipulate the DOM if needed
      this.renderer.removeClass(this.navbarDefault.nativeElement, 'hidden');
    } else {
      this.renderer.addClass(this.navbarDefault.nativeElement, 'hidden');
    }
  }



}


