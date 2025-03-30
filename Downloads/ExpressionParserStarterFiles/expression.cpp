/*
 * expression.cpp
 *
 * Class implementations for expression functionality.
 *
 * You will have to implement any additional functions you decide
 * to include in expression.h.
 */

#include "expression.h"

Expression::~Expression( )
   {
   }

Number::Number( int64_t val ) :
      value( val )
   {
   }

int64_t Number::Eval( ) const
   {
   return value;
   }

Add::Add(Expression *l, Expression *r) : left(l), right(r)
   {
   }

Add::~Add()
   {
   delete left;
   delete right;
   }

int64_t Add::Eval() const
   {
   return left->Eval() + right->Eval();
   }

Multiply::Multiply(Expression *l, Expression *r) : left(l), right(r)
   {
   }

Multiply::~Multiply()
   {
   delete left;
   delete right;
   }

int64_t Multiply::Eval() const
   {
   return left->Eval() * right->Eval();
   }
