import { HttpResponse } from '@angular/common/http';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { ICategory } from '../../core/interfaces/icategory';
import { SubCategoriesService } from '../../core/services/subCategories/sub-categories.service';
import { ISubCategory } from '../../core/interfaces/isub-category';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {

  private readonly _CategoriesService = inject(CategoriesService);
  private readonly _SubCategoriesService = inject(SubCategoriesService)
  categoriesList: WritableSignal<ICategory[]> = signal([]);
  subCategoriesList: WritableSignal<ISubCategory[]> = signal([]);

  ngOnInit(): void {
    this.getCategories();
    this.getSubCategories("6439d3e067d9aa4ca97064c3");
  }

  getCategories(): void {
    this._CategoriesService.getAllCategories().subscribe({
      next: (res) => {
        console.log(res);
        this.categoriesList.set(res.data);
        console.log("categories", this.categoriesList());
      },
    })
  }

  getSubCategories(id: string): void {
    this._SubCategoriesService.getSubCategoriesByCategory(id).subscribe({
      next: (res) =>{
        console.log("sub cat",res);
        this.subCategoriesList.set(res.data);
      }
    })
  }

}
