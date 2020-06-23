import { Component, OnInit } from '@angular/core';

import { products } from '../products';
import { CartService } from '../cart.service';
import { RouteParams } from '@reactiveangular/router';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product;

  constructor(
    private routeParams$: RouteParams<{ productId: string }>,
    private cartService: CartService
  ) { }

  ngOnInit() {
    this.routeParams$.subscribe(params => {
      this.product = products[+params.productId];
    });
  }

  addToCart(product) {
    this.cartService.addToCart(product);
    window.alert('Your product has been added to the cart!');
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/