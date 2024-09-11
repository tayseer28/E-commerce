import { Component, inject, signal, WritableSignal } from '@angular/core';
import { BrandService } from '../../core/services/brand/brand.service';
import { IBrand } from '../../core/interfaces/ibrand';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss'
})
export class BrandsComponent {

  private readonly _BrandService = inject(BrandService);

  brandsList: WritableSignal<IBrand[]> = signal([]);



  ngOnInit(): void {
    this.getBrands();
  }

  getBrands(): void {
    this._BrandService.getAllBrands().subscribe({
      next: (res) => {
        console.log(res);
        this.brandsList.set(res.data);
        console.log("brands", this.brandsList());
      },
    })
  }

}
